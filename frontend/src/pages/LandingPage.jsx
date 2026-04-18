import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, FileText, Bot, ArrowRight, ShieldCheck, Globe, LogIn, ChevronRight, BarChart3, TrendingUp, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
const logo = '/logo.png'

const LandingPage = () => {
  const navigate = useNavigate()
  const login = useStore((state) => state.login)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleDemoLogin = () => {
    setIsLoggingIn(true)
    setTimeout(() => {
      login({
        id: 1,
        name: 'Global Industrial Group',
        industry: 'Manufacturing',
        energyCost: 4500,
        currency: 'USD',
        monthly_energy_usage: 2800
      })
      navigate('/dashboard')
    }, 1500)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-background text-text-main font-sans"
    >
      {/* Header / Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="EcoPulse Logo" className="w-10 h-10 object-contain" />
            <div>
              <div className="text-2xl font-display font-bold text-primary tracking-tight">EcoPulse</div>
              <div className="text-[10px] font-sans font-bold tracking-[0.2em] text-accent uppercase">Sustainability Intelligence</div>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-text-muted">
              <button className="hover:text-primary transition-colors">Platform</button>
              <button className="hover:text-primary transition-colors">Solutions</button>
              <button className="hover:text-primary transition-colors">Enterprise</button>
              <button className="hover:text-primary transition-colors">Pricing</button>
            </div>
            <button 
              onClick={handleDemoLogin} 
              className="btn-glow flex items-center gap-2 h-11 px-7 rounded-lg"
            >
              <LogIn className="w-4 h-4" /> 
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-bold text-[10px] tracking-[0.2em] uppercase mb-8"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accelerating Global ESG Standards</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-6xl lg:text-7xl font-display font-extrabold leading-[1.1] text-primary mb-8"
            >
              Empowering the <span className="text-accent underline decoration-accent/30 underline-offset-8">Net-Zero</span> Future with AI.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-xl text-text-light mb-12 max-w-2xl leading-relaxed font-medium"
            >
              EcoPulse transforms complex industrial data into actionable sustainability intelligence. Achieve your ESG benchmarks and drive growth through precision AI analytics.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start"
            >
              <button onClick={handleDemoLogin} disabled={isLoggingIn} className="btn-glow w-full sm:w-auto h-14 px-10 flex items-center justify-center gap-3 text-lg">
                 {isLoggingIn ? 'Initializing Platform...' : 'Get Started'}
                 {!isLoggingIn && <ArrowRight className="w-5 h-5" />}
              </button>
              <button className="btn-outline w-full sm:w-auto h-14 px-10 border-slate-200 text-slate-700 hover:border-primary hover:bg-slate-50">
                 Book a Demo
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="flex-1 w-full"
          >
            <div className="glass-panel p-2 rounded-2xl shadow-2xl bg-white border-slate-100">
              <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="h-12 bg-white border-b border-slate-100 flex items-center px-6 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-sans">Intelligence Engine v4.0</div>
                </div>
                <div className="p-10 bg-white">
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Carbon Reduction</div>
                      <div className="text-3xl font-display font-bold text-primary">12.8% <span className="text-sm text-accent font-sans">MoM</span></div>
                    </div>
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Energy Efficiency</div>
                      <div className="text-3xl font-display font-bold text-primary">94.2% <span className="text-sm text-accent font-sans">Active</span></div>
                    </div>
                  </div>
                  <div className="h-40 flex items-end gap-3 px-2">
                    {[65, 80, 75, 95, 85, 115, 100, 85, 110, 95, 105, 120].map((h, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + i * 0.05 }}
                        className={`flex-1 ${i % 2 === 0 ? 'bg-primary' : 'bg-accent/40'} rounded-t-md`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-primary mb-6">Built for Modern Sustainability</h2>
            <p className="text-text-light font-medium">Modular, AI-driven solutions designed to scale with your enterprise objectives.</p>
          </div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: TrendingUp, title: 'Predictive ROI Modeling', desc: 'Anticipate energy fluctuations and forecast the ROI of sustainability investments with neural accuracy.' },
              { icon: Zap, title: 'Rapid Decarbonization', desc: 'Leverage AI to identify immediate high-impact operational shifts to reduce your carbon footprint.' },
              { icon: Globe, title: 'ESG Compliance Hub', desc: 'Centralized monitoring and reporting for global environmental standards and ESG frameworks.' },
              { icon: ShieldCheck, title: 'Incentive Discovery', desc: 'Automated matching with global subsidies, grants, and tax credits based on your activity profile.' },
              { icon: FileText, title: 'Intelligent Invoicing', desc: 'OCR-powered document processing for precise energy and cost auditing across your facilities.' },
              { icon: Activity, title: 'Real-time Telemetry', desc: 'Live data visualization and anomaly detection for critical infrastructure and consumption points.' }
            ].map((pillar, i) => (
              <motion.div variants={item} key={i} className="glass-panel p-10 hover:border-accent group bg-white">
                <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-8 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <pillar.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{pillar.title}</h3>
                <p className="text-text-muted leading-relaxed text-sm font-medium">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
         <div className="absolute inset-0 bg-accent/5 opacity-50"></div>
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl font-display font-bold text-white mb-8">Ready to accelerate your transition?</h2>
            <div className="flex items-center justify-center gap-6">
               <button onClick={handleDemoLogin} className="h-14 px-10 rounded-lg bg-accent text-primary font-bold hover:bg-white transition-all">Start Your Free Audit</button>
               <button className="h-14 px-10 rounded-lg border border-white/20 text-white font-bold hover:bg-white/10 transition-all">Contact Sales</button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <img src={logo} alt="EcoPulse Logo" className="w-8 h-8" />
              <span className="text-2xl font-display font-bold tracking-tight text-primary">EcoPulse</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-8 font-medium">
              Transforming industrial data into a net-zero future through artificial intelligence and precision ESG analytics.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-8">Platform</div>
            <ul className="space-y-4 text-sm text-text-muted font-medium">
              <li className="hover:text-accent cursor-pointer transition-colors text-sm">Predictive Modeling</li>
              <li className="hover:text-accent cursor-pointer transition-colors text-sm">Carbon Auditing</li>
              <li className="hover:text-accent cursor-pointer transition-colors text-sm">Incentive Discovery</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-8">Legal</div>
            <ul className="space-y-4 text-sm text-text-muted font-medium">
              <li className="hover:text-accent cursor-pointer transition-colors text-sm">Data Security</li>
              <li className="hover:text-accent cursor-pointer transition-colors text-sm">Privacy Policy</li>
              <li className="hover:text-accent cursor-pointer transition-colors text-sm">GDPR Compliance</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-8">Company</div>
            <ul className="space-y-4 text-sm text-text-muted font-medium">
              <li className="hover:text-accent cursor-pointer transition-colors text-sm">About Us</li>
              <li className="hover:text-accent cursor-pointer transition-colors text-sm">Contact Support</li>
              <li className="hover:text-accent cursor-pointer transition-colors text-sm">Newsroom</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-100 mt-20 pt-10 text-[10px] text-text-muted font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-6">
          <span>© 2026 EcoPulse Intelligence. All rights reserved.</span>
          <div className="flex gap-10">
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

export default LandingPage
