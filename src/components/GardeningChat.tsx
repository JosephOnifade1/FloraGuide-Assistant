import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';

const SYSTEM_INSTRUCTION = `You are Flora, a world-class botanical expert and gardening assistant. 
Your tone is warm, professional, encouraging, and deeply knowledgeable. 
You can help with:
- Plant care schedules (watering, fertilizing, pruning).
- Diagnosing pests and diseases based on descriptions.
- Recommending plants for specific environments (low light, humid, outdoor zones).
- Soil preparation and sustainable gardening practices.
Keep your answers evidence-based but accessible to home gardeners. If the user asks something not about plants or gardening, gently redirect them.
When providing lists or care steps, use bullet points for readability.`;

export function GardeningChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await geminiService.chat([...messages, userMessage], SYSTEM_INSTRUCTION);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I'm sorry, I'm having trouble connecting to my botanical databases. Could you try asking me again?" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-[2rem] shadow-sm border border-sage-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-sage-600 p-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-serif text-lg leading-tight">Flora</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sage-100 text-[10px] uppercase tracking-widest font-bold">Botanical Expert</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[radial-gradient(#f1f5f1_1px,transparent_1px)] [background-size:24px_24px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
            <div className="p-4 bg-sage-50 rounded-full">
              <Sparkles className="w-12 h-12 text-sage-400" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-serif text-sage-900">Ask Flora anything about your garden</h4>
              <p className="text-sage-500 text-sm italic">
                Need a watering schedule for your Monstera? Or wondering why your roses have white spots?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full">
              {[
                "How to revive a wilting peace lily?",
                "Best houseplants for low-light apartments?",
                "When to fertilize indoor succulents?"
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(query); }}
                  className="text-left p-3 text-sm border border-sage-100 rounded-xl hover:bg-sage-50 hover:border-sage-200 transition-all font-medium text-sage-700"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1",
                  msg.role === 'user' ? "bg-clay-600" : "bg-sage-600"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
                </div>
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-clay-50 text-clay-950 border border-clay-100" 
                    : "bg-sage-50 text-sage-900 border border-sage-100"
                )}>
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-8 h-8 rounded-xl bg-sage-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="bg-sage-50 border border-sage-100 p-4 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-sage-600" />
              <span className="text-sage-500 text-xs font-serif italic tracking-wide">Flora is thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-sage-100">
        <form onSubmit={handleSend} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your gardening question..."
            className="w-full bg-sage-50 border border-sage-200 rounded-2xl py-4 pl-6 pr-14 text-sage-900 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all font-sans"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-sage-600 text-white rounded-xl flex items-center justify-center hover:bg-sage-700 disabled:bg-sage-200 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <p className="text-[10px] text-center text-sage-400 mt-3 uppercase tracking-widest font-bold">
          Powered by Gemini 3 series intelligence
        </p>
      </div>
    </div>
  );
}
