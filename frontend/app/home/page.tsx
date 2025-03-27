import ChatForm from "@/components/ChatForm";
import { ModeToggle } from "@/components/theme";

export default function ChatPage() {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen">
            {/* Theme Toggle Positioned in Top-Right */}
            <div className="absolute top-0 right-4">
                <ModeToggle />
            </div>

            {/* Main Content */}
            <h1 className="text-3xl font-bold">Welcome to CogniHub</h1>
            <div className="p-4">
                <p className="text-gray-500">
                    Select a model and enter your prompt to get a response from the AI.
                </p>
            </div>
            <ChatForm />
        </div>
    );
}