import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, FileText, Bot, ArrowRight, ShieldCheck, Globe, LogIn } from 'lucide-react'
import useStore from '../store/useStore'
import LiveDataPulse from '../components/LiveDataPulse'

const LandingPage = () => {
  const login = useStore((state) => state.login)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleDemoLogin = () => {
    setIsLoggingIn(true)
    setTimeout(() => {
      login({
        name: 'Nexus Corp',
        industry: 'manufacturing',
        energyCost: 4500,
        currency: 'USD'
      })
    }, 1500)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <LiveDataPulse count={20} />
      
      {/* Top Navbar */}
      <nav className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="EcoPulse Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-display font-bold tracking-tight text-white">EcoPulse</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-text-muted hover:text-white cursor-pointer transition-colors text-sm font-medium">Features</span>
          <span className="hidden sm:inline text-text-muted hover:text-white cursor-pointer transition-colors text-sm font-medium">Pricing</span>
          <button onClick={handleDemoLogin} className="text-white hover:text-primary transition-colors text-sm font-bold flex items-center gap-2">
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 sm:pt-48 pb-20 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8 shadow-glow-primary backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse w-2 h-2"></span>
          EcoPulse AI Advisor v2.0
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-display font-extrabold text-white max-w-4xl leading-[1.1] tracking-tight"
        >
          Sustainability. <span className="text-transparent bg-clip-text bg-glow-gradient">Decoded by AI.</span> Optimized for Profit.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-lg sm:text-xl text-text-muted max-w-2xl font-light"
        >
          Empower your MSME with the world's most advanced AI sustainability advisor. Track carbon, predict costs, and unlock hidden subsidies in one unified control center.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <button onClick={handleDemoLogin} disabled={isLoggingIn} className="btn-glow w-full sm:w-auto h-14 min-w-[200px]">
             {isLoggingIn ? 'Authenticating...' : 'Start Analysis'}
             {!isLoggingIn && <ArrowRight className="w-5 h-5 opacity-80" />}
          </button>
          <button className="h-14 px-8 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all w-full sm:w-auto">
             View Live Demo
          </button>
        </motion.div>
      </div>

      {/* Floating Demo Preview Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
        className="w-full max-w-5xl mx-auto px-6 relative z-10 mb-32"
      >
        <div className="rounded-2xl border border-white/10 bg-background-surface/80 backdrop-blur-2xl p-2 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl pointer-events-none"></div>
          <div className="w-full h-[400px] rounded-xl bg-background-layered border border-white/5 flex flex-col overflow-hidden relative">
             <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/80"></div><div className="w-3 h-3 rounded-full bg-yellow-500/80"></div><div className="w-3 h-3 rounded-full bg-green-500/80"></div></div>
                <div className="mx-auto w-48 h-6 bg-background rounded-md border border-white/5"></div>
             </div>
             <div className="flex-1 flex p-6 gap-6">
                 {/* Mock UI Blocks */}
                 <div className="w-64 space-y-4">
                    <div className="h-20 bg-background border border-white/5 rounded-xl"></div>
                    <div className="h-20 bg-background border border-white/5 rounded-xl"></div>
                    <div className="h-20 bg-primary/10 border border-primary/20 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 p-0 h-full bg-primary"></div>
                    </div>
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="h-full bg-background border border-white/5 rounded-xl p-4 flex flex-col justify-end">
                       <div className="h-32 w-full flex items-end gap-2 px-10">
                          { [40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                             <motion.div 
                               initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 1 + i*0.1 }}
                               key={i} className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-primary shadow-[0_0_10px_#00E676]' : 'bg-white/10'}`}>
                             </motion.div>
                          )) }
                       </div>
                    </div>
                 </div>
             </div>
             {/* Gradient fade out at bottom */}
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-layered to-transparent"></div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-white">Engineered for Next-Gen Sustainability</h2>
          <p className="text-text-muted mt-2">Replace manual audits with autonomous intelligence.</p>
        </div>
        
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Activity, title: 'Predictive Alerts', desc: 'AI identifies energy anomalies and warns you before you exceed thresholds.', color: 'primary' },
            { icon: Bot, title: 'What-If Simulator', desc: 'Model ROI dynamically. Slide adoption rates and see immediate financial impact.', color: 'accent' },
            { icon: Globe, title: 'Carbon Tracker', desc: 'Real-time footprint logging tied to universal GHG protocols automatically.', color: 'blue-500' },
            { icon: ShieldCheck, title: 'Subsidy Finder', desc: 'Matches local governmental schemes directly to your operational profile.', color: 'purple-500' },
            { icon: FileText, title: 'Document Automation', desc: 'Drop utility bills. Neural parsing extracts metrics flawlessly in seconds.', color: 'yellow-500' },
            { icon: Zap, title: 'Real-Time Insights', desc: 'Actionable micro-optimizations served directly to your control center.', color: 'primary' }
          ].map((feat, i) => (
            <motion.div variants={item} key={i} className="glass-panel p-8 glass-panel-hover group relative overflow-hidden">
               <div className={`absolute top-0 right-0 w-32 h-32 bg-${feat.color}/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-transform group-hover:scale-150`}></div>
               <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-${feat.color} group-hover:bg-${feat.color}/10 transition-colors`}>
                 <feat.icon className={`w-6 h-6 text-white`} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
               <p className="text-text-muted text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
             <Zap className="w-5 h-5 text-primary" />
             <span className="font-display font-bold text-white">EcoPulse</span>
           </div>
           <p className="text-text-muted text-sm">Built for MSMEs. Designed to scale.</p>
           <div className="flex gap-4 text-sm text-text-muted">
             <span className="hover:text-white cursor-pointer">Privacy</span>
             <span className="hover:text-white cursor-pointer">Terms</span>
           </div>
        </div>
      </footer>
    </motion.div>
  )
}

export default LandingPage
