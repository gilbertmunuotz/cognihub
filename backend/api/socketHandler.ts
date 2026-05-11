import { AxiosError } from "axios";
import axios from "axios";
import type { IncomingMessage } from "http";
import { Server, Socket } from "socket.io";
import type { Readable } from "stream";
import { OLLAMA_MODEL, OLLAMA_URL } from "../constants/constant";
import type { AnalyzeDocumentPayload } from "../interfaces/interface";
import { cleanResponse } from "../helpers/response";
import { buildAnalyzePrompt } from '../helpers/prompt'


async function streamOllamaToSocket(body: Readable, socket: Socket): Promise<void> {
    return new Promise((resolve, reject) => {
        let lineBuffer = "";

        body.on("data", (chunk: Buffer | string) => {
            lineBuffer += typeof chunk === "string" ? chunk : chunk.toString("utf8");
            const lines = lineBuffer.split("\n");
            lineBuffer = lines.pop() ?? "";

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;
                try {
                    const json = JSON.parse(trimmedLine) as { response?: string };
                    if (typeof json.response === "string" && json.response.length > 0) {
                        socket.emit("response", cleanResponse(json.response));
                    }
                } catch {
                    // Ignore partial or non-JSON lines
                }
            }
        });

        body.on("end", () => {
            const remainder = lineBuffer.trim();
            if (remainder) {
                try {
                    const json = JSON.parse(remainder) as { response?: string };
                    if (typeof json.response === "string" && json.response.length > 0) {
                        socket.emit("response", cleanResponse(json.response));
                    }
                } catch {
                    // ignore
                }
            }
            resolve();
        });

        body.on("error", reject);
    });
}

export function handleSocketConnection(io: Server): void {
    io.on("connection", (socket: Socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("analyzeDocument", async (data: AnalyzeDocumentPayload) => {
            const { text, instruction, model: clientModel } = data ?? {};

            if (!text?.trim()) {
                socket.emit("error", "Text is required.");
                return;
            }

            const model = clientModel?.trim() || OLLAMA_MODEL;

            const prompt = buildAnalyzePrompt(text, instruction);

            try {
                const response = await axios.post(
                    OLLAMA_URL,
                    { model, prompt, stream: true },
                    {
                        responseType: "stream",
                        validateStatus: () => true,
                    },
                );

                const streamBody = response.data as IncomingMessage | Readable;

                if (response.status >= 400) {
                    const errorChunks: Buffer[] = [];
                    await new Promise<void>((resolve) => {
                        streamBody.on("data", (c: Buffer) => errorChunks.push(c));
                        streamBody.on("end", () => resolve());
                        streamBody.on("error", () => resolve());
                    }).catch(() => undefined);
                    const detail = Buffer.concat(errorChunks).toString("utf8").slice(0, 2000);
                    socket.emit(
                        "error",
                        `Ollama error (${response.status}): ${detail || response.statusText}`,
                    );
                    return;
                }

                await streamOllamaToSocket(streamBody, socket);
                socket.emit("done", "Message stream complete!");
            } catch (error: unknown) {
                console.error("Error processing analyzeDocument:", error);

                if (axios.isAxiosError(error)) {
                    const ax = error as AxiosError<{ error?: string }>;
                    const msg =
                        typeof ax.response?.data === "object" && ax.response?.data?.error
                            ? String(ax.response.data.error)
                            : ax.message;
                    socket.emit("error", msg || "Failed to process request");
                    return;
                }

                socket.emit("error", "Failed to process request");
            }
        });
    });
}
