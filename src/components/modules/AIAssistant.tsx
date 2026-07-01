import { useState, useEffect } from "react";
import { GlobalSettingsToggle } from "../ui/GlobalSettingsToggle";
import { Send, Loader2, Bot } from "lucide-react";
import Markdown from "react-markdown";
import { cn } from "../../lib/utils";
import { processAIEstimate } from "../../lib/gemini";
import { CalculationHistory } from "../ui/CalculationHistory";

interface Message {
  role: "user" | "model";
  content: string;
  isStreaming?: boolean;
}

// Simulated streaming effect component
function StreamingMessage({ content, isStreaming, onComplete }: { content: string, isStreaming?: boolean, onComplete?: () => void }) {
  const [displayedContent, setDisplayedContent] = useState(isStreaming ? "" : content);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedContent(content);
      return;
    }

    let currentIndex = 0;
    const streamInterval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        if (onComplete) onComplete();
      }
    }, 15); // Adjust typing speed here (ms per char)

    return () => clearInterval(streamInterval);
  }, [content, isStreaming, onComplete]);

  return <Markdown>{displayedContent}</Markdown>;
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
          isStreaming: true,
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
          isStreaming: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamingComplete = (index: number) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, isStreaming: false } : msg
      )
    );
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-slate-900 p-4 sm:p-8 md:p-8">
      <div className="flex-1 calc-input flex flex-col overflow-hidden relative shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 bg-transparent flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <h2 className="uppercase st text-xl font-semibold text-slate-900 tracking-tight mb-4">
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
                  "rounded-[24px] px-5 py-3 max-w-[85%] text-sm shadow-sm",
                  msg.role === "user"
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-transparent text-slate-700 border border-slate-100 leading-relaxed",
                )}
              >
                {msg.role === "model" ? (
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-slate-800 prose-a:text-indigo-600 prose-th:bg-slate-100 prose-td:border-slate-200">
                    <StreamingMessage 
                      content={msg.content} 
                      isStreaming={msg.isStreaming} 
                      onComplete={() => handleStreamingComplete(index)} 
                    />
                  </div>
                ) : (
                  <div className="leading-relaxed">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="w-full flex gap-4 md:max-w-4xl md:mx-auto justify-start px-4 md:px-0 flex-wrap">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1">
                <Loader2 className="w-[18px] h-[18px] text-indigo-600 animate-spin" />
              </div>
              <div className="rounded-[24px] px-5 py-4 bg-transparent border border-slate-100 flex items-center gap-2 shadow-sm overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-200 bg-white relative">
          <div className="w-full md:max-w-4xl md:mx-auto relative flex items-center px-4 md:px-0">
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
              className="w-full bg-transparent border border-slate-200 rounded-[24px] py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-indigo-500/50 focus:border-indigo-500 resize-none min-h-[44px] max-h-[120px] text-slate-800 shadow-sm transition-all overflow-hidden"
              rows={1}
            />
            <button aria-label="Send" onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-2.5 p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-semibold active:scale-95 hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
            >
              <Send className="w-[16px] h-[16px]" />
            </button>
          </div>
          <div className="text-center mt-3 text-sm text-slate-500 font-bold uppercase tracking-widest">
            AI generated estimates are preliminary. Always confirm with a
            certified QS.
          </div>
        </div>
      </div>
      <CalculationHistory
        calculatorId="ai_assistant"
        estimationName="AI Assistant Chat"
        currentInputs={{}}
      />
    </div>
  );
}
