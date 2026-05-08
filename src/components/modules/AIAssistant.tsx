import { useState } from "react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { Send, Loader2, Bot } from "lucide-react";
import Markdown from "react-markdown";
import { cn } from "../../lib/utils";
import { processAIEstimate } from "../../lib/gemini";
interface Message {
  role: "user" | "model";
  content: string;
}
export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hello! I am your AI-powered Civil Engineering Estimator. Describe your project requirements (e.g., 'Estimate materials for a 10x10 room with a 10ft ceiling'), and I will provide a preliminary cost and material breakdown using NLP extraction.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    try {
      const content = await processAIEstimate(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            content || "I was unable to generate an estimate at this time.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Error executing estimation. Please check your API key configuration and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8">
      <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden relative shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700 whitespace-nowrap">
            AI Assistant
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-4 max-w-4xl mx-auto",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "model" && (
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-[18px] h-[18px] text-indigo-600" />
                </div>
              )}
              <div
                className={cn(
                  "rounded-2xl px-5 py-3 max-w-[85%] text-sm shadow-sm",
                  msg.role === "user"
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-slate-50 text-slate-700 border border-slate-100 leading-relaxed",
                )}
              >
                {msg.role === "model" ? (
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-slate-800 prose-a:text-indigo-600 prose-th:bg-slate-100 prose-td:border-slate-200">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (
                  <div className="leading-relaxed">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-4xl mx-auto justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1">
                <Loader2 className="w-[18px] h-[18px] text-indigo-600 animate-spin" />
              </div>
              <div className="rounded-2xl px-5 py-4 bg-slate-50 border border-slate-100 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-200 bg-white relative">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about cost optimization or estimation..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[44px] max-h-[120px] text-slate-800 shadow-sm transition-all flex-1 min-w-fit whitespace-nowrap"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-2.5 p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-[16px] h-[16px]" />
            </button>
          </div>
          <div className="text-center mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            AI generated estimates are preliminary. Always confirm with a
            certified QS.
          </div>
        </div>
      </div>
    </div>
  );
}
