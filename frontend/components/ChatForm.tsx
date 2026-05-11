"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Paperclip, Send } from "lucide-react";
import { BACKEND_URL } from "@/constants/constant";
import { ChatFormProps } from "@/interfaces/interface";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ChatForm({ onChatInteraction }: ChatFormProps) {
    const onInteractionRef = useRef(onChatInteraction);
    onInteractionRef.current = onChatInteraction;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [instruction, setInstruction] = useState("");
    const [text, setText] = useState("");
    const [, setResponse] = useState("");
    const [uploading, setUploading] = useState(false);
    const [socketError, setSocketError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(BACKEND_URL, {
            transports: ["websocket", "polling"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            setSocketError(null);
        });
        socket.on("disconnect", () => setConnected(false));
        socket.on("connect_error", (err) => {
            console.error("Socket connect_error:", err);
            setConnected(false);
            setSocketError("Could not connect to the server. Is the backend running?");
        });

        socket.on("response", (data: string) => {
            setResponse((prev) => {
                const next = prev + data;
                onInteractionRef.current(next);
                return next;
            });
        });

        socket.on("done", () => {
            setSocketError(null);
        });

        socket.on("error", (err: unknown) => {
            const msg = typeof err === "string" ? err : "Request failed";
            setSocketError(msg);
            console.error("Socket error:", err);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setUploading(true);
        setSocketError(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post<{ text?: string }>(
                `${BACKEND_URL}/api/v1/service/file/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            const extracted = res.data?.text ?? "";
            setText(extracted);
            if (!extracted.trim()) {
                setSocketError("No text could be extracted from this file.");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setSocketError(axios.isAxiosError(err) ? err.message : "File upload failed");
        } finally {
            setUploading(false);
        }
    };

    const sendRequest = () => {
        if (!socketRef.current?.connected) {
            setSocketError("Not connected. Start the backend and refresh.");
            return;
        }
        const t = text.trim();
        if (!t) return;

        setSocketError(null);
        setResponse("");
        onInteractionRef.current("");
        socketRef.current.emit("analyzeDocument", {
            text: t,
            ...(instruction.trim() ? { instruction: instruction.trim() } : {}),
        });
        setText("");
        setInstruction("");
    };

    const sendDisabled = !text.trim() || uploading || !connected;

    return (
        <div className="w-full space-y-3 rounded-2xl border border-border bg-card p-4 shadow-md">
            {socketError && (
                <p className="text-sm text-destructive" role="alert">
                    {socketError}
                </p>
            )}

            <div className="space-y-1">
                <Label htmlFor="instruction">Instruction (optional)</Label>
                <textarea
                    id="instruction"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="e.g. Summarize in 5 bullets; only use the TEXT."
                    className="w-full min-h-[56px] max-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
            </div>

            <div className="rounded-2xl border border-border p-2">
                <div className="space-y-1 px-1 pb-2">
                    <Label htmlFor="text">TEXT to analyze</Label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste content, or attach a PDF / DOCX below."
                        className="w-full min-h-[120px] max-h-[280px] resize-y rounded-md bg-transparent focus:outline-none"
                    />
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleUpload}
                />

                <div className="flex items-center justify-between">
                    <span className="grow">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    type="button"
                                    className="cursor-pointer disabled:opacity-50"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                >
                                    <Paperclip />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{uploading ? "Uploading…" : "Attach PDF or DOCX"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </span>

                    <Button
                        type="button"
                        onClick={sendRequest}
                        disabled={sendDisabled}
                        className="w-28 flex items-center justify-center gap-1"
                    >
                        <Send size={18} />
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}
