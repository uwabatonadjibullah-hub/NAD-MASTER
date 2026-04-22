import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MoreHorizontal, Settings2, CheckCircle2 } from 'lucide-react';
import { ai, SYSTEM_INSTRUCTIONS } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPlan?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Peace be upon you. I am your NAD MASTER AI assistant. How may I assist you with your studies or training today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: userMessage.content }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS,
        }
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I apologize, but I am unable to process that request at the moment.",
        timestamp: new Date(),
        // Simple heuristic for "Plan" detection for visual demo
        isPlan: response.text?.toLowerCase().includes('plan') || response.text?.toLowerCase().includes('week'),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Response failed:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-5rem)] md:h-[calc(100vh-4rem)] bg-surface overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div className={cn(
               "w-10 h-10 shrink-0 border flex items-center justify-center rounded",
               msg.role === 'assistant' ? "bg-primary border-primary text-on-primary" : "bg-transparent border-outline/50 overflow-hidden"
            )}>
              {msg.role === 'assistant' ? (
                <Bot size={20} />
              ) : (
                auth.currentUser?.photoURL ? (
                  <img src={auth.currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-on-surface-variant" />
                )
              )}
            </div>

            {/* Bubble */}
            <div className={cn(
              "max-w-[85%] p-5 rounded-xl shadow-sm border",
              msg.role === 'assistant' 
                ? "bg-surface-container border-outline-variant/30 rounded-tl-none" 
                : "bg-primary-container text-on-primary-container border-primary/20 rounded-tr-none"
            )}>
              <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-p:m-0 space-y-4">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>

              {/* Special Plan UI Logic */}
              {msg.isPlan && (
                <div className="mt-6 border-t border-outline/10 pt-6 space-y-4 animate-in zoom-in-95 duration-500">
                  <div className="flex justify-end gap-3">
                    <button className="px-5 py-2 label-caps !text-[10px] border border-primary text-primary rounded-full hover:bg-primary/5 transition-colors flex items-center gap-2">
                      <Settings2 size={12} />
                      Adjust Plan
                    </button>
                    <button className="px-5 py-2 label-caps !text-[10px] bg-primary text-on-primary rounded-full hover:opacity-90 transition-opacity flex items-center gap-2">
                       <CheckCircle2 size={12} />
                      Accept Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary border border-primary rounded flex items-center justify-center text-on-primary animate-pulse">
              <MoreHorizontal size={20} />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#100e0d] border-t border-outline/10 p-4 md:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask NAD MASTER..."
              className="w-full bg-transparent border-none border-b-2 border-outline/30 focus:border-primary focus:ring-0 transition-colors text-on-surface py-3 px-0 resize-none max-h-48 scrollbar-hide font-body-md"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={cn(
              "w-12 h-12 rounded flex items-center justify-center transition-all bg-primary text-on-primary",
              (!input.trim() || isTyping) && "opacity-50 cursor-not-allowed scale-90"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
