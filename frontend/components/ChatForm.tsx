"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";


export default function ChatForm() {

    const [model, setModel] = useState("llama3.2:latest");
    const [text, setText] = useState("");
    const [response, setResponse] = useState("");
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:8000");

        socketRef.current.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });

        socketRef.current.on("response", (data) => {
            // Log each chunk of data received
            console.log("Received chunk:", data)
            setResponse((prev) => prev + data); // Append response chunks
        });

        socketRef.current.on("done", () => {
            console.log("Message stream complete!")
            // Log the final complete response
            console.log("Complete response:", response)
        });

        socketRef.current.on("error", (error) => {
            console.error("Socket.IO error:", error);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const sendRequest = () => {
        if (!socketRef.current) {
            console.error("Socket.IO not connected");
            return;
        }
        setResponse(""); // Clear previous response
        socketRef.current.emit("message", { model, prompt: text });
    };

    return (
        <div>
            <select onChange={(e) => setModel(e.target.value)}>
                <option value="llama3.2:latest">LLaMA 3.2</option>
                <option value="deepseek-r1:7b">DeepSeek R1</option>
            </select>
            <textarea onChange={(e) => setText(e.target.value)} />
            <button onClick={sendRequest}>Analyze</button>
            <p>Response: {response}</p>
        </div>
    )
}
