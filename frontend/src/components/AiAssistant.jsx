import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Zap, MessageSquare, Loader2, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiService } from '../services/api'

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am EcoPulse AI. I can analyze your energy patterns, find subsidies, or help model cost-saving scenarios. How can I assist your operations today?' }
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
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the neural network. Please check your connection." }])
    } finally {
      setIsTyping(false)
    }
  }

  const suggestions = [
    "Identify active subsidies",
    "Model solar ROI",
    "Analyze monthly bill trends"
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] glass-panel border border-white/5 relative overflow-hidden bg-background-surface/30">
      
      {/* Header Panel */}
      <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-background-surface/80 backdrop-blur-xl z-20">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-glow-primary">
               <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white tracking-tight">EcoPulse Intelligence</h3>
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Neural Network Online</p>
            </div>
         </div>
         <div className="hidden sm:flex items-center gap-3">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-background bg-slate-800" />)}
            </div>
            <span className="text-xs text-text-muted font-medium">Synced with EPA Database</span>
         </div>
      </div>

      {/* Chat History */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 z-10 custom-scrollbar scroll-smooth">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

         <AnimatePresence>
            {messages.map((msg, i) => (
               <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                  key={i} className={`flex gap-6 max-w-4xl transition-all ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
               >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-background-layered border border-white/10' : 'bg-primary border border-primary-dark shadow-glow-primary'}`}>
                     {msg.role === 'user' ? <User className="w-5 h-5 text-text-muted" /> : <Bot className="w-5 h-5 text-background" />}
                  </div>
                  <div className={`p-6 rounded-3xl text-sm leading-relaxed relative ${
                     msg.role === 'user' 
                     ? 'bg-primary/5 border border-primary/20 text-text-main rounded-tr-sm' 
                     : 'bg-white/5 border border-white/5 text-text-main rounded-tl-sm'
                  }`}>
                     {msg.content}
                     <div className={`absolute top-4 ${msg.role === 'user' ? '-right-2 border-l-primary/20' : '-left-2 border-r-white/5'} w-0 h-0 border-y-[10px] border-y-transparent border-x-[10px]`}></div>
                  </div>
               </motion.div>
            ))}

            {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                  <div className="w-10 h-10 rounded-2xl bg-primary border border-primary-dark shadow-glow-primary flex items-center justify-center">
                     <Bot className="w-5 h-5 text-background" />
                  </div>
                  <div className="bg-white/5 border border-white/5 p-6 rounded-3xl rounded-tl-sm flex gap-1.5 items-center">
                     <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></span>
                     <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                     <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-white/5 bg-background-surface/80 backdrop-blur-2xl z-20 space-y-6">
         
         <div className="flex flex-wrap gap-2.5">
            {suggestions.map((s, i) => (
               <button key={i} onClick={() => handleSend(s)} className="text-[10px] font-bold px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-text-muted hover:border-primary/40 hover:text-white transition-all flex items-center gap-2 group uppercase tracking-widest">
                  <ChevronRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform" /> {s}
               </button>
            ))}
         </div>

         <div className="relative flex items-center gap-4 bg-background-layered/50 p-2 rounded-2xl border border-white/5 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <textarea 
               value={input} onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
               placeholder="How should I optimize my sustainability trajectory?"
               className="flex-1 max-h-32 min-h-[56px] bg-transparent border-none focus:ring-0 text-text-main placeholder-text-muted/50 resize-none py-4 px-4 text-sm font-medium"
               rows={1}
            />
            <button 
               onClick={() => handleSend()}
               disabled={!input.trim() || isTyping}
               className="w-14 h-14 rounded-xl bg-glow-gradient flex items-center justify-center text-background hover:scale-105 active:scale-95 transition-all shadow-glow-primary disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 shrink-0"
            >
               {isTyping ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </button>
         </div>
      </div>
    </div>
  )
}

export default AiAssistant
