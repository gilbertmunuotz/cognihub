"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ChatForm from "@/components/ChatForm";

export default function ChatPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChatInteraction = (newResponse: string) => {
    setResponse(newResponse);
    setShowWelcome(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
        {showWelcome ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Welcome to CogniHub</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Add instructions and text—or attach a PDF or DOCX. Replies stream from your local LLM below.
            </p>
          </div>
        ) : null}

        <section aria-label="Message">
          <ChatForm onChatInteraction={handleChatInteraction} />
        </section>

        {!showWelcome ? (
          <section
            aria-label="Assistant reply"
            className="rounded-xl border border-border bg-card px-4 py-4"
          >
            {response.trim() ? (
              <div className="space-y-4">
                <div className="prose prose-invert max-w-none leading-relaxed prose-p:leading-relaxed">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
                <div className="not-prose flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    <Copy className="mr-2 size-4" />
                    Copy
                  </button>
                  {copied ? (
                    <span className="text-sm text-muted-foreground">Copied to clipboard</span>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="animate-pulse text-sm italic text-muted-foreground">Thinking…</p>
            )}
          </section>
        ) : null}
      </main>
    </div>
  );
}
