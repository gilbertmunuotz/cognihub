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
import { ChatFormProps } from "@/interfaces/interface";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"


export default function ChatForm({ onChatInteraction }: ChatFormProps) {

    const [model, setModel] = useState("");
    const [text, setText] = useState("");
    const [response, setResponse] = useState("");
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(`${SERVER_URI}`);

        socketRef.current.on("response", (data) => {
            setResponse((prev) => {
                const newResponse = prev + data;
                onChatInteraction(newResponse); // Pass cleaned response to parent
                return newResponse;
            });
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

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const sendRequest = () => {
        if (!socketRef.current) {
            console.error("Socket.IO not connected");
            return;
        }
        socketRef.current.emit("message", { model, prompt: text });
        setResponse(""); // Clear local response
        setText(""); // Clear input after sending
        onChatInteraction(""); // Trigger "Thinking..." state
    };

    return (
        <div className="w-full max-w-5xl p-4 bg-zinc-100 dark:bg-black rounded-2xl shadow-md">
            <div className="border border-gray-300 dark:border-gray-700 p-2 resize-none rounded-2xl">
                <div className="flex w-full">
                    {/* Expandable TextArea */}
                    <textarea
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Enter Prompt Here..."
                        className="w-full min-h-[40px] max-h-[200px] overflow-hidden resize-none rounded-md focus:outline-none"
                    />
                </div>

                <div className="flex items-center justify-between">
                    {/* Paper Clip  */}
                    <span className="flex-grow">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className=" cursor-pointer">
                                    <Paperclip />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Attach File</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                        <Button onClick={sendRequest} disabled={!text.trim() || !model} className="w-24 flex items-center justify-center cursor-pointer">
                            <Send size={18} />Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}