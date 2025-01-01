import { useState, useRef, useEffect } from "react";
import { getClient } from "@/lib/client";
import { transactionsChatbot } from "@kaching/sdk";
import useAuthenticated from "@/lib/useAuthenticated";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotInterfaceProps {
  transactions: any[];
}

const STORED_PROMPTS_KEY = "chatbot_stored_prompts";
const MAX_STORED_PROMPTS = 5;

export function ChatbotInterface({ transactions }: ChatbotInterfaceProps) {
  const authenticated = useAuthenticated();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [storedPrompts, setStoredPrompts] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORED_PROMPTS_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const storePrompt = (prompt: string) => {
    setStoredPrompts((prev) => {
      const filtered = prev.filter((p) => p !== prompt);
      const updated = [prompt, ...filtered].slice(0, MAX_STORED_PROMPTS);
      localStorage.setItem(STORED_PROMPTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !authenticated) return;

    const userMessage = input.trim();
    setInput("");
    storePrompt(userMessage);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const client = getClient();
      const response = await client(transactionsChatbot).executeFunction({
        prompt: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response as string },
      ]);
    } catch (error: any) {
      console.error("Error calling chatbot:", error);
      const errorMessage =
        "Sorry, I encountered an error processing your request.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-gray-50 rounded-lg">
      {storedPrompts.length > 0 && (
        <div className="py-2 border-b bg-white">
          <p className="text-xs text-gray-500 mb-2">Previous prompts:</p>
          <div className="flex flex-wrap gap-2">
            {storedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full truncate max-w-[200px]">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-black text-white"
                  : "bg-white border border-gray-200"
              }`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your transactions..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
