"use client"

import ChatForm from "@/components/ChatForm";
import { ModeToggle } from "@/components/theme";
import { useState } from "react";

export default function ChatPage() {

    const [showWelcome, setShowWelcome] = useState(true); // Controls welcome visibility
    const [response, setResponse] = useState(""); // Stores LLM response

    // Callback to update response and hide welcome when user interacts
    const handleChatInteraction = (newResponse: string) => {
        setResponse(newResponse);
        setShowWelcome(false);
    }

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
                        <h1 className="text-4xl font-bold">Welcome to CogniHub</h1>
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
                                <p>{response}</p>
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