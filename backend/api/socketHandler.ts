// *** Import NPM Packages *** //
import { Server, Socket } from "socket.io";
import { OLLAMA_URL } from "../constants/constant";
import axios from 'axios';
import { RequestBody } from "interfaces/interface";

// (DESC) Handle Socket.IO events
export async function handleSocketConnection(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("message", async (data) => {

            // Destructure Request Body and explicitly type it
            const { model, prompt }: RequestBody = data;

            // Validate required fields
            if (!model || !prompt) {
                socket.emit("error", "Model and prompt are required!");
                return;
            }

            try {
                // Stream data from Ollama API
                const response = await axios.post(
                    OLLAMA_URL,
                    { model, prompt },
                    { responseType: "stream" } 
                );

                response.data.on("data", (chunk: { toString: () => string; }) => {
                    try {
                        const json = JSON.parse(chunk.toString());
                        if (json.response) {
                            socket.emit("response", json.response);
                        }
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                });

                response.data.on("end", () => {
                    socket.emit("done", "Message stream complete!");
                });

            } catch (error) {
                console.error("Error processing request:", error);
                socket.emit("error", "Failed to process request");
            }
        });
    })
}