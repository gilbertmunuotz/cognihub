"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SERVER_URI } from "@/constants/constant";

export default function ChatForm() {

    const [model, setModel] = useState("");
    const [text, setText] = useState("");
    const [response, setResponse] = useState("");
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(`${SERVER_URI}`);

        socketRef.current.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });

        socketRef.current.on("response", (data) => {
            setResponse((prev) => prev + data);
        });

        socketRef.current.on("done", () => {
            console.log("Complete response:", response)
        });

        socketRef.current.on("error", (error) => {
            console.error("Socket.IO error:", error);
        });

        return () => {
            socketRef.current?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendRequest = () => {
        if (!socketRef.current) {
            console.error("Socket.IO not connected");
            return;
        }
        console.log(response);
        socketRef.current.emit("message", { model, prompt: text });
        setResponse(""); // Clear previous response
    };

    return (
        <div className="w-full max-w-3xl p-4 bg-zinc-100 dark:bg-black rounded-lg shadow-md">
            {/* Chat Responses */}
            {/* <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-red-600 dark:bg-red-600">
                {response}
            </div> */}

            <div className="border border-gray-300 dark:border-gray-700 p-2 resize-none rounded-md">
                <div className="flex w-full mb-4">
                    {/* Expandable TextArea */}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter Prompt Here..."
                        className="w-full min-h-[40px] max-h-[200px] overflow-hidden resize-none rounded-md focus:outline-none"
                    />
                </div>

                <div className="flex items-center justify-between">
                    {/* Paper Clip  */}
                    <span className="flex-grow">
                        <Paperclip />
                    </span>

                    <div className="flex items-center gap-2">
                        {/* Model Selector */}
                        <Select onValueChange={setModel}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Pick model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="llama3.2:latest">Llama 3.2</SelectItem>
                                <SelectItem value="deepseek-r1:7b">DeepSeek R1</SelectItem>
                            </SelectContent>
                        </Select>


                        {/* Send Button */}
                        <Button onClick={sendRequest} className="w-24 flex items-center justify-center">
                            <Send size={18} />Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}