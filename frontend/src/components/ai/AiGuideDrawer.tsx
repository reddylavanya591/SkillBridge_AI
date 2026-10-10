import React, { useState, useRef, useEffect } from 'react';
import { askAiMentor } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';
import { AiChatMessage } from '../../types';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Lightbulb,
  Code2,
  Flame,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  Zap,
  HelpCircle
} from 'lucide-react';

interface AiGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextHint?: string;
}

export const AiGuideDrawer: React.FC<AiGuideDrawerProps> = ({ isOpen, onClose, contextHint }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Hello! I am your **SkillBridge AI Career & DSA Mentor**.\n\nI can help you with:\n- **DSA Strategy & Hints** for Two Sum, Binary Search, Stacks, etc.\n- **Code Review & Debugging** in Java, JS, or Python.\n- **Java Full Stack Concepts** (Spring Boot 3, SQL, OOP, REST).\n- **Daily Streak & Learning Consistency** coaching.\n\nHow can I guide your preparation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleCopySnippet = (snippet: string, msgId: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(msgId);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const response = await askAiMentor(
        textToSend,
        contextHint || `Target Role: ${user?.targetRole || 'Java Full Stack Developer'}, User: ${user?.name || 'Student'}`
      );

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: response.answer,
        codeSnippet: response.codeSuggestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: AiChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: 'I had trouble reaching the AI service. Try asking about a specific DSA topic like Two Sum, Binary Search, or Spring Boot injection!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const promptChips = [
    'How do I maintain my study streak?',
    'Give me a hint for Two Sum',
    'Explain Spring Boot constructor injection',
    'Binary Search midpoint overflow guard',
    'What should I prioritize on my roadmap?'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-stone-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 bg-gradient-to-r from-purple-50 via-white to-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-purple-200" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <span>SkillBridge AI Guide</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full font-bold">Live</span>
              </h3>
              <p className="text-[11px] text-stone-500">Career & DSA Interactive Mentor</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages(messages.slice(0, 1))}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
              title="Clear Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-[#0F382C] text-white rounded-br-none'
                    : 'bg-stone-50 text-stone-800 rounded-bl-none border border-stone-200'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-line text-xs font-sans">
                  {m.content}
                </div>

                {m.codeSnippet && (
                  <div className="relative group">
                    <pre className="p-3 rounded-xl bg-stone-900 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-stone-800">
                      <code>{m.codeSnippet}</code>
                    </pre>
                    <button
                      onClick={() => handleCopySnippet(m.codeSnippet!, m.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                      title="Copy Snippet"
                    >
                      {copiedSnippetId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                <span className={`block text-[10px] text-right ${
                  m.sender === 'user' ? 'text-stone-300' : 'text-stone-400'
                }`}>
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold shadow-2xs">
                  {user?.name.charAt(0) || 'U'}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-stone-500">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-stone-100 border border-stone-200">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-stone-100 bg-stone-50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-purple-700 hover:border-purple-300 transition-colors whitespace-nowrap text-[11px] shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-stone-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI guide for a hint, concept, or code review..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
