import React, { useState } from 'react'
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am EcoPulse AI. I can analyze your energy patterns, find subsidies, or help model cost-saving scenarios. How can I assist your operations today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = (text = input) => {
    if (!text.trim()) return
    
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setIsTyping(true)

    // Simulate API delay
    setTimeout(() => {
      let response = "Based on your current load data, upgrading to smart LEDs could save you approx. 12% on your baseline utility cost within a 6-month ROI window. Would you like me to add this to your Action Plan?"
      if (text.toLowerCase().includes("subsidy")) {
         response = "You are currently eligible for the 'MSME Green Tech Grant' which covers 40% of hardware capital expenditure for energy upgrades. Let's start the application proxy if you are ready."
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 1500)
  }

  const suggestions = [
    "How can I reduce my electricity cost?",
    "Am I eligible for subsidies?",
    "Generate a summary of my emissions"
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] glass-panel border border-white/5 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
         {messages.map((msg, i) => (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
               key={i} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-background-layered border border-white/10' : 'bg-primary border border-primary-dark shadow-glow-primary'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-text-muted" /> : <Bot className="w-4 h-4 text-background" />}
               </div>
               <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-background-layered border border-white/10 text-text-main rounded-tr-sm' 
                  : 'bg-white/5 border border-white/5 text-text-main rounded-tl-sm'
               }`}>
                  {msg.content}
               </div>
            </motion.div>
         ))}

         {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-primary border border-primary-dark shadow-glow-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-background" />
               </div>
               <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0.4s' }}></span>
               </div>
            </motion.div>
         )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-background-surface/80 backdrop-blur-md z-10 space-y-4">
         
         <div className="flex flex-wrap gap-2 mb-2">
            {suggestions.map((s, i) => (
               <button key={i} onClick={() => handleSend(s)} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> {s}
               </button>
            ))}
         </div>

         <div className="relative flex items-end gap-3">
            <textarea 
               value={input} onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
               placeholder="Query the AI..."
               className="flex-1 max-h-32 min-h-[56px] input-fancy resize-none py-4"
               rows={1}
            />
            <button 
               onClick={() => handleSend()}
               disabled={!input.trim() || isTyping}
               className="w-14 h-14 rounded-xl bg-glow-gradient flex items-center justify-center text-background hover:scale-105 active:scale-95 transition-all shadow-glow-primary disabled:opacity-50 disabled:hover:scale-100"
            >
               <Send className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  )
}

export default AiAssistant
