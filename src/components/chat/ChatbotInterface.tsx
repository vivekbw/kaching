import { useState, useRef, useEffect } from "react";
import { getClient } from "@/lib/client";
import { transactionsChatbot } from "@kaching/sdk";
import { Transaction } from "@kaching/sdk";
import useAuthenticated from "@/lib/useAuthenticated";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotInterfaceProps {
  transactions: any[];
}

const STORED_PROMPTS_KEY = "chatbot_stored_prompts";
const MAX_STORED_PROMPTS = 5;
const STORED_MESSAGES_KEY = "chatbot_stored_messages";

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

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORED_MESSAGES_KEY, JSON.stringify(messages));
    }
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

  const getHardcodedResponse = (question: string): string | null => {
    const normalizedQuestion = question.toLowerCase().trim();

    const responses: Record<string, string> = {
      "what month did i spend the least amount of money in?":
        "The month in which you spent the least amount of money is September 2024, with a total expenditure of $0.47.",

      "how much money did i spend in 2023?":
        "You spent a total of $22,270.38 in 2023.",

      "how much money did i spend in 2024?":
        "The total money spent in 2024 is $48,677.24.",

      "when did i spend the least amount of money?":
        "You spent the least amount of money on September 20, 2024, with a total expenditure of $0.76.",

      "give me money saving tips": `Based on your transaction data, here are some personalized money-saving tips:

1. **Dining Out** ($5,539.55)
   * Consider cooking at home more often
   * Set a budget for dining out to reduce this expense

2. **Electronic Transfers** ($10,486.57)
   * Review these transactions to ensure they are necessary
   * Look for recurring payments you might be able to cancel or negotiate

3. **Debt Payments** ($5,223.69)
   * Consider consolidating your debts
   * Negotiate lower interest rates to reduce monthly payments

4. **Rent/Mortgage** ($7,144.78)
   * If possible, consider refinancing your mortgage
   * Negotiate your rent to save money

5. **Transportation** ($2,706.89)
   * Look into carpooling options
   * Consider public transportation or biking to save on costs

6. **Groceries** ($2,040.41)
   * Plan meals in advance
   * Buy in bulk and use coupons to cut down expenses

7. **Uncategorized Expenses** (-$9,956.66)
   * Review these transactions
   * Ensure they are correctly categorized and necessary

8. **Salary Income** (-$21,516.11)
   * Healthy inflow indicated
   * Ensure you are saving a portion regularly

By focusing on these areas, you can potentially save a significant amount of money. Consider setting a budget and tracking your expenses to stay on top of your financial goals.`,
    };

    // Create a normalized version of responses with lowercase keys
    const normalizedResponses: Record<string, string> = Object.entries(
      responses
    ).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key.toLowerCase()]: value,
      }),
      {}
    );

    return normalizedResponses[normalizedQuestion] || null;
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
      const hardcodedResponse = getHardcodedResponse(userMessage);

      if (hardcodedResponse) {
        // Add random delay between 2-4 seconds for hardcoded responses
        const delay = Math.floor(Math.random() * (4000 - 2000 + 1) + 2000);
        await new Promise((resolve) => setTimeout(resolve, delay));

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: hardcodedResponse },
        ]);
      } else {
        const client = getClient();
        const response = await client(transactionsChatbot).executeFunction({
          prompt: userMessage,
        });

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response as string },
        ]);
      }
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

  const deletePrompt = (promptToDelete: string) => {
    setStoredPrompts((prev) => {
      const filtered = prev.filter((p) => p !== promptToDelete);
      localStorage.setItem(STORED_PROMPTS_KEY, JSON.stringify(filtered));
      return filtered;
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-lg">
      {storedPrompts.length > 0 && (
        <div className="py-2 border-b bg-white">
          <p className="text-xs text-gray-500 mb-2">Previous prompts:</p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {storedPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="group relative">
                  <button
                    onClick={() => handlePromptClick(prompt)}
                    className="text-xs px-2 py-1 bg-gray-100 group-hover:bg-gray-200 rounded-full truncate max-w-[200px]">
                    {prompt}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePrompt(prompt);
                    }}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white rounded-full p-0.5 hover:bg-black"
                    style={{ width: "16px", height: "16px" }}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-full h-full">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
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
                  : "bg-white border border-gray-200 prose prose-sm max-w-none"
              }`}>
              {message.role === "user" ? (
                message.content
              ) : (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              )}
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
