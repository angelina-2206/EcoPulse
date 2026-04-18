import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Zap, MessageSquare, Loader2, ChevronRight, ShieldCheck, PieChart, Activity, Globe, Copy, Trash2, Download, Check, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiService } from '../services/api'

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your EcoPulse Strategy Advisor. I've analyzed your current enterprise profile and identified several high-impact sustainability growth opportunities. How can I assist you in optimizing your ESG strategy today?", id: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (text = input) => {
    const messageText = typeof text === 'string' ? text : input
    if (!messageText.trim()) return
    
    setMessages(prev => [...prev, { role: 'user', content: messageText, id: Date.now() }])
    setInput('')
    setIsTyping(true)

    try {
      const response = await aiService.chat(messageText)
      setMessages(prev => [...prev, { role: 'assistant', content: response.content || response, id: Date.now() + 1 }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm experiencing a temporary connection issue with our neural processing hub. Please try again in a moment.", id: Date.now() + 2 }])
    } finally {
      setIsTyping(false)
    }
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearChat = () => {
    if (window.confirm("Clear all strategic intelligence logs? This action cannot be undone.")) {
      setMessages([{ role: 'assistant', content: "Logs cleared. Awaiting new strategic inquiries.", id: Date.now() }])
    }
  }

  const suggestions = [
    { label: "Find carbon grants", icon: ShieldCheck },
    { label: "ROI on solar", icon: Zap },
    { label: "Efficiency benchmarks", icon: Activity }
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] glass-panel border border-slate-200 relative overflow-hidden bg-white shadow-2xl rounded-3xl">
      
      {/* Advisor Header */}
      <div className="px-12 py-8 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md z-20">
         <div className="flex items-center gap-6">
            <div className="relative">
               <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 relative z-10">
                  <Bot className="w-8 h-8 text-accent" />
               </div>
               <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse -z-0"></div>
            </div>
            <div>
               <h3 className="text-2xl font-display font-bold text-primary tracking-tight">EcoPulse Strategy Advisor</h3>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Artificial Intelligence Active</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 mr-6">
               <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Activity className="w-4 h-4 text-primary opacity-40" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Link v4.0</span>
               </div>
               <div className="w-px h-10 bg-slate-100"></div>
            </div>
            <button onClick={clearChat} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
               <Trash2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 transition-all">
               <Download className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Chat Log */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 z-10 bg-slate-50/30 custom-scrollbar">
         <AnimatePresence>
            {messages.map((msg, i) => (
               <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                  key={msg.id} className={`flex gap-6 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
               >
                  <div className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center shrink-0 transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-white text-primary border border-slate-100' : 'bg-primary text-accent'}`}>
                     {msg.role === 'user' ? <User className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                  </div>
                  <div className={`group p-8 rounded-3xl text-sm leading-relaxed shadow-sm relative border transition-all ${
                     msg.role === 'user' 
                     ? 'bg-white border-slate-100 text-slate-700 rounded-tr-none' 
                     : 'bg-primary text-white border-primary-dark rounded-tl-none shadow-xl shadow-primary/5'
                  }`}>
                     <div className="flex justify-between items-center mb-4">
                        <div className={`font-black text-[9px] uppercase tracking-[0.3em] pb-2 w-fit border-b border-dashed ${msg.role === 'user' ? 'text-slate-300 border-slate-200' : 'text-accent border-accent/20'}`}>
                           {msg.role === 'user' ? 'Strategic Inquiry' : 'AI Actionable Insight'}
                        </div>
                        {msg.role === 'assistant' && (
                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => copyToClipboard(msg.content, msg.id)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-accent">
                                 {copiedId === msg.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-accent">
                                 <Share2 className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        )}
                     </div>
                     <p className="font-medium">{msg.content}</p>
                     
                     {msg.role === 'assistant' && i === messages.length - 1 && !isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 flex items-center gap-3">
                           <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                              <span className="text-[9px] font-bold text-emerald-100/60 uppercase tracking-widest">Decision Trusted</span>
                           </div>
                        </motion.div>
                     )}
                  </div>
               </motion.div>
            ))}

            {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-accent flex items-center justify-center shadow-lg shadow-primary/10">
                     <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="bg-primary text-white p-8 rounded-3xl rounded-tl-none flex gap-5 items-center shadow-xl shadow-primary/10">
                     <div className="flex gap-1.5">
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 rounded-full bg-accent"></motion.div>
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} className="w-2.5 h-2.5 rounded-full bg-accent"></motion.div>
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} className="w-2.5 h-2.5 rounded-full bg-accent"></motion.div>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Synthesizing intelligence</span>
                        <span className="text-[9px] font-bold text-accent/60 italic uppercase tracking-widest">Scanning market data...</span>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Input Interface */}
      <div className="p-10 border-t border-slate-100 bg-white/95 backdrop-blur-md z-20">
         <div className="flex flex-wrap gap-4 mb-8">
            {suggestions.map((s, i) => (
               <button key={i} onClick={() => handleSend(s.label)} className="text-[10px] font-black px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:border-accent hover:text-primary transition-all flex items-center gap-3 uppercase tracking-widest group shadow-sm bg-gradient-to-r hover:from-slate-50 hover:to-white">
                  <s.icon className="w-3.5 h-3.5 text-accent opacity-50 group-hover:opacity-100" /> {s.label}
               </button>
            ))}
         </div>

         <div className="relative flex items-center gap-6 bg-white p-2 rounded-2xl border border-slate-200 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/5 transition-all shadow-md group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-200 group-focus-within:text-accent transition-colors">
               <MessageSquare className="w-5 h-5" />
            </div>
            <textarea 
               value={input} onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
               placeholder="Ask anything about your sustainability strategy..."
               className="flex-1 max-h-32 min-h-[64px] bg-transparent border-none focus:ring-0 text-primary placeholder-slate-300 resize-none py-5 pl-14 pr-6 text-sm font-semibold"
               rows={1}
            />
            <button 
               onClick={() => handleSend()}
               disabled={!input.trim() || isTyping}
               className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white hover:bg-primary-light active:scale-[0.9] transition-all shadow-xl shadow-primary/20 disabled:opacity-30 shrink-0 relative overflow-hidden group/btn"
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
               {isTyping ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send className="w-7 h-7 text-accent relative z-10" />}
            </button>
         </div>
         <div className="mt-6 flex items-center justify-center gap-10">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Neural Analytics v4.2.1</p>
            <div className="w-px h-3 bg-slate-200"></div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">End-to-End Encrypted Inquiry</p>
         </div>
      </div>
    </div>
  )
}

export default AiAssistant
