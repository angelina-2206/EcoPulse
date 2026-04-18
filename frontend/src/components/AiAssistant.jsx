import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Zap, MessageSquare, Loader2, ChevronRight, ShieldCheck, PieChart, Activity, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiService } from '../services/api'

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your EcoPulse Strategy Advisor. I've analyzed your current enterprise profile and identified several high-impact sustainability growth opportunities. How can I assist you in optimizing your ESG strategy today?" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (text = input) => {
    const messageText = typeof text === 'string' ? text : input
    if (!messageText.trim()) return
    
    setMessages(prev => [...prev, { role: 'user', content: messageText }])
    setInput('')
    setIsTyping(true)

    try {
      const response = await aiService.chat(messageText)
      setMessages(prev => [...prev, { role: 'assistant', content: response.content || response }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm experiencing a temporary connection issue with our neural processing hub. Please try again in a moment." }])
    } finally {
      setIsTyping(false)
    }
  }

  const suggestions = [
    "Identify available ESG grants",
    "Model solar roi scenario",
    "Review industry benchmarks"
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] glass-panel border border-slate-200 relative overflow-hidden bg-white shadow-2xl rounded-3xl">
      
      {/* Advisor Header */}
      <div className="px-12 py-8 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md z-20">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
               <Bot className="w-8 h-8 text-accent" />
            </div>
            <div>
               <h3 className="text-2xl font-display font-bold text-primary tracking-tight">EcoPulse Strategy Advisor</h3>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Artificial Intelligence Active</span>
               </div>
            </div>
         </div>
         <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
               <Activity className="w-4 h-4 text-primary opacity-40" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Link v4.0</span>
            </div>
            <div className="w-px h-10 bg-slate-100"></div>
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
               <Globe className="w-6 h-6" />
            </div>
         </div>
      </div>

      {/* Chat Log */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 z-10 bg-slate-50/30 custom-scrollbar">
         <AnimatePresence>
            {messages.map((msg, i) => (
               <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                  key={i} className={`flex gap-6 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
               >
                  <div className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center shrink-0 transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-white text-primary border border-slate-100' : 'bg-primary text-accent'}`}>
                     {msg.role === 'user' ? <User className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                  </div>
                  <div className={`p-8 rounded-3xl text-sm leading-relaxed shadow-sm relative border ${
                     msg.role === 'user' 
                     ? 'bg-white border-slate-100 text-slate-700 rounded-tr-none' 
                     : 'bg-primary text-white border-primary-dark rounded-tl-none'
                  }`}>
                     <div className={`font-black text-[9px] uppercase tracking-[0.3em] mb-4 pb-2 w-fit border-b border-dashed ${msg.role === 'user' ? 'text-slate-300 border-slate-200' : 'text-accent border-accent/20'}`}>
                        {msg.role === 'user' ? 'Inquiry' : 'AI Insight'}
                     </div>
                     <p className="font-medium">{msg.content}</p>
                  </div>
               </motion.div>
            ))}

            {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-accent flex items-center justify-center shadow-lg shadow-primary/10">
                     <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="bg-primary text-white p-8 rounded-3xl rounded-tl-none flex gap-4 items-center">
                     <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 opacity-50">Analyzing...</span>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Input Interface */}
      <div className="p-10 border-t border-slate-100 bg-white/95 backdrop-blur-md z-20">
         <div className="flex flex-wrap gap-4 mb-8">
            {suggestions.map((s, i) => (
               <button key={i} onClick={() => handleSend(s)} className="text-[10px] font-black px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:border-accent hover:text-primary transition-all flex items-center gap-3 uppercase tracking-widest group shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform"></div> {s}
               </button>
            ))}
         </div>

         <div className="relative flex items-center gap-6 bg-white p-2 rounded-2xl border border-slate-200 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/5 transition-all shadow-sm">
            <textarea 
               value={input} onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
               placeholder="Ask anything about your sustainability strategy..."
               className="flex-1 max-h-32 min-h-[64px] bg-transparent border-none focus:ring-0 text-primary placeholder-slate-300 resize-none py-5 px-6 text-sm font-semibold"
               rows={1}
            />
            <button 
               onClick={() => handleSend()}
               disabled={!input.trim() || isTyping}
               className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white hover:bg-primary-light active:scale-[0.9] transition-all shadow-xl shadow-primary/20 disabled:opacity-30 shrink-0"
            >
               {isTyping ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send className="w-7 h-7 text-accent" />}
            </button>
         </div>
         <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase text-center tracking-[0.3em]">AI-Powered Strategic Decision Support</p>
      </div>
    </div>
  )
}

export default AiAssistant
