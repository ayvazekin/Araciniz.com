"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAIAdvisorAnalysis } from "@/actions/ai-advisor";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface VehicleData {
  brand: string;
  series?: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  damage_status?: string;
  engine_power?: number;
  torque?: number;
  max_speed?: number;
  acceleration_0_100?: number;
  fuel_consumption_avg?: number;
  engine_cc?: number;
  city?: string;
  description?: string;
  tramer_amount?: number;
}

interface AIAdvisorChatProps {
  vehicle: VehicleData;
}

export default function AIAdvisorChat({ vehicle }: AIAdvisorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Modal açıldığında input'a focus
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // İlk açılışta otomatik analiz
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleSendMessage("Bu araç alınır mı? Detaylı bir analiz yap.");
    }
  }, [isOpen]);

  const handleSendMessage = async (question: string) => {
    if (isLoading || !question.trim()) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Chat history'yi hazırla (son 10 mesaj)
    const chatHistory = [...messages, userMessage].slice(-10);

    const result = await getAIAdvisorAnalysis(vehicle, question, chatHistory);

    if (result.success && result.analysis) {
      setMessages((prev) => [...prev, { role: "assistant", content: result.analysis! }]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.error || "Bir hata oluştu. Lütfen tekrar deneyin." },
      ]);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput("");
    await handleSendMessage(question);
  };

  const quickQuestions = [
    "Fiyatı uygun mu?",
    "Kilometre fazla mı?",
    "Bakım maliyeti ne kadar?",
    "Değer kaybı nasıl?",
    "Pazarlık yapılır mı?",
    "Dikkat edilecek noktalar?",
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow Effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#B8860B] to-[#DAA520] rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
        
        {/* Pulse Ring */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-[#B8860B] to-[#DAA520] rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Button */}
        <div className="relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#B8860B] to-[#DAA520] rounded-full text-black font-medium text-[13px] shadow-lg shadow-[#B8860B]/30">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          AI Uzmanına Sor
        </div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Chat Window */}
            <motion.div
              className="relative w-full max-w-lg bg-[#0a0a0a] rounded-2xl border border-[#B8860B]/20 overflow-hidden shadow-2xl shadow-[#B8860B]/10"
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="relative px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-[#0f0f0f] to-[#0a0a0a]">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B]/50 to-transparent" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B8860B]/20 to-[#DAA520]/10 border border-[#B8860B]/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#DAA520]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      {/* Online indicator */}
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-white">AI Uzman Danışman</h3>
                      <p className="text-[11px] text-white/40">
                        {vehicle.brand} {vehicle.series || vehicle.model} • {vehicle.year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Clear chat button */}
                    {messages.length > 0 && (
                      <button
                        onClick={() => setMessages([])}
                        className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-white/30 hover:text-white/60"
                        title="Sohbeti temizle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#B8860B]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-white/30 text-[13px]">Analiz başlatılıyor...</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-[#DAA520]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#B8860B] text-black rounded-br-md"
                          : "bg-white/[0.05] text-white/80 border border-white/[0.06] rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center mr-2 flex-shrink-0">
                      <svg className="w-4 h-4 text-[#DAA520]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div className="px-4 py-3 bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-bl-md">
                      <div className="flex items-center gap-1">
                        <motion.span
                          className="w-2 h-2 bg-[#B8860B] rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-[#B8860B] rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-[#B8860B] rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                        />
                        <span className="ml-2 text-[11px] text-white/30">yazıyor</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length > 0 && !isLoading && (
                <div className="px-4 pb-2 border-t border-white/[0.04] pt-3">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Hızlı Sorular</p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendMessage(q)}
                        className="flex-shrink-0 px-3 py-1.5 bg-white/[0.03] hover:bg-[#B8860B]/10 border border-white/[0.06] hover:border-[#B8860B]/30 rounded-full text-[11px] text-white/50 hover:text-[#DAA520] transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-white/[0.06] bg-[#080808]">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Bu araç hakkında bir şey sorun..."
                    className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] focus:border-[#B8860B]/30 rounded-xl text-[13px] text-white placeholder:text-white/30 focus:outline-none transition-colors"
                    disabled={isLoading}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-4 py-3 bg-gradient-to-r from-[#B8860B] to-[#DAA520] disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-black transition-all"
                    whileHover={{ scale: input.trim() && !isLoading ? 1.02 : 1 }}
                    whileTap={{ scale: input.trim() && !isLoading ? 0.98 : 1 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
