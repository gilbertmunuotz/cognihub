import ChatForm from "@/components/ChatForm";

export default function ChatPage() {
    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">AI Chat Application</h1>
            <p className="mb-4 text-gray-600">Select a model and enter your prompt to get a response from the AI.</p>

            <ChatForm />
        </div>
    )
}
