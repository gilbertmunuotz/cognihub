"use client"

import { useState, } from "react";
import { Copy } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import ChatForm from "@/components/ChatForm";
import { ModeToggle } from "@/components/theme";

export default function ChatPage() {
    const { data: session } = useSession();

    const [showWelcome, setShowWelcome] = useState(true); // Controls welcome visibility
    const [response, setResponse] = useState(""); // Stores LLM response
    const [copied, setCopied] = useState(false); // Tracks if text is copied

    // Callback to update response and hide welcome when user interacts
    const handleChatInteraction = (newResponse: string) => {
        setResponse(newResponse);
        setShowWelcome(false);
    }

    // Copy response to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(response).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }).catch((err) => console.error("Failed to copy:", err));
    };

    return (
        <div className="relative flex flex-col min-h-screen">
            {/* Theme Toggle Positioned in Top-Right */}
            <div className="absolute top-0 right-4 z-10">
                <ModeToggle />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center">
                {showWelcome && response === '' ? (
                    <div className="mt-36 text-center">
                        <h1 className="text-4xl font-bold">Welcome {session?.user?.name}</h1>
                        <div className="p-4">
                            <p className="text-lg text-gray-500">
                                Select a model and enter your prompt to get a response from the AI.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl">
                        <div className="min-h-[200px] max-h-[500px] overflow-y-auto bg-white dark:bg-black">
                            {response ? (
                                <div className="leading-relaxed space-y-4 prose dark:prose-invert">
                                    <ReactMarkdown>{response}</ReactMarkdown>
                                    {/* Copy Button - Placed Right Below the Response */}
                                    <button onClick={copyToClipboard} className="bg-blue-500 text-white px-1 py-1 mt-2 cursor-pointer rounded-md hover:bg-blue-600">
                                        <Copy />
                                    </button>

                                    {/* Copy Feedback Message */}
                                    {copied && (
                                        <p className="text-green-500 text-sm mx-4">✅ Copied to clipboard!</p>
                                    )}
                                </div>
                            ) : (
                                <p className="mr-3 size-5 animate-pulse italic">
                                    Thinking....
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Form - Always Visible */}
            <div className="w-full max-w-3xl mx-auto pt-7 pb-7">
                <ChatForm onChatInteraction={handleChatInteraction} />
            </div>
        </div>

    );
}