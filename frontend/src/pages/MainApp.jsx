import React from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, SlidersHorizontal, MessageSquare, ShieldCheck, FileText, Bell, LogOut, Globe, Settings, User, CreditCard, ChevronRight, Activity, Zap, Shield, Target } from 'lucide-react'
import useStore from '../store/useStore'
const logo = '/logo.png'

// Import Components
import DashboardAnalytics from '../components/DashboardAnalytics'
import WhatIfSimulator from '../components/WhatIfSimulator'
import AiAssistant from '../components/AiAssistant'
import SubsidyChecker from '../components/SubsidyChecker'
import DocumentAutomation from '../components/DocumentAutomation'

const MainApp = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useStore((state) => state.logout)
  const businessData = useStore((state) => state.businessData)

  const navItems = [
    { path: '/dashboard', label: 'Executive Analytics', icon: LayoutDashboard },
    { path: '/simulator', label: 'ROI Simulator', icon: SlidersHorizontal },
    { path: '/assistant', label: 'ESG AI Advisor', icon: MessageSquare },
    { path: '/subsidy', label: 'Capital Recovery', icon: ShieldCheck },
    { path: '/documents', label: 'Smart Audit', icon: FileText },
  ]

  const currentModule = navItems.find(item => item.path === location.pathname) || navItems[0]

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      
      {/* Sidebar Layout - Modern Emerald Style */}
      <aside className="w-80 bg-primary flex flex-col z-20 shadow-2xl relative">
         <div className="h-24 flex items-center px-8 gap-4 border-b border-white/5">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg shadow-black/20">
               <img src={logo} alt="EcoPulse" className="w-full h-full object-contain" />
            </div>
            <div>
               <div className="text-2xl font-display font-bold text-white tracking-tight">EcoPulse</div>
               <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Enterprise AI</div>
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto py-10 px-6 space-y-1 custom-scrollbar-sidebar">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-4 mb-6">Platform Core</p>
            {navItems.map((item) => (
               <Link
                 key={item.path}
                 to={item.path}
                 className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group ${location.pathname === item.path ? 'bg-white text-primary shadow-2xl' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
               >
                 <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-accent' : 'group-hover:text-accent transition-colors'}`} />
                 <span className="font-bold text-sm tracking-tight">{item.label}</span>
                 {location.pathname === item.path && (
                    <motion.div layoutId="sidebar-active" className="absolute right-4 w-1.5 h-6 bg-accent rounded-full" transition={{ type: 'spring', bounce: 0.2 }} />
                 )}
               </Link>
            ))}

            <div className="mt-12 pt-12 border-t border-white/5 space-y-4">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-4 mb-6">Enterprise Status</p>
               
               {/* Sustainability Pulse Widget */}
               <div className="px-5 py-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">ESG Health</span>
                     <span className="text-xs font-black text-accent">84%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-accent shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                  <p className="text-[9px] text-white/30 mt-4 font-bold flex items-center gap-2">
                     <Zap className="w-3 h-3 text-accent" />
                     TARGET: NET-ZERO 2030
                  </p>
               </div>
            </div>
         </div>

         {/* Enhanced Profile Block */}
         <div className="p-8 bg-primary-dark/40 border-t border-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center p-0.5 border border-white/10 shadow-xl">
                        <div className="w-full h-full rounded-xl bg-accent flex items-center justify-center text-primary font-black text-xl">
                           {businessData?.name?.[0] || 'A'}
                        </div>
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-primary-dark rounded-full shadow-lg"></div>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                     <span className="text-sm font-black text-white truncate tracking-tight">{businessData?.name || 'Administrator'}</span>
                     <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-accent font-black uppercase tracking-widest">{businessData?.industry || 'Manufacturing'}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest italic">ID: #8294</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => { logout(); navigate('/'); }} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5 group">
                  <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
               </button>
            </div>
            
            <div className="group bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all hover:border-white/10 shadow-lg">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                     <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">Enterprise Plan</span>
                     <span className="text-xs text-white font-black tracking-tight group-hover:text-accent transition-colors">Workspace Settings</span>
                  </div>
               </div>
               <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-accent transition-all group-hover:translate-x-1" />
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50">
         
         {/* Top Header - Modern Corporate Style */}
         <header className="h-24 border-b border-slate-200 flex items-center justify-between px-12 bg-white/95 backdrop-blur-md z-10 shadow-sm">
            <div className="flex flex-col">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                     <currentModule.icon className="w-4 h-4" />
                  </div>
                  <h1 className="text-3xl font-display font-black text-primary tracking-tighter">
                     {currentModule.label}
                  </h1>
               </div>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">EcoPulse Insight</span>
                  <span className="text-[10px] text-slate-200 font-bold">/</span>
                  <span className="text-[10px] text-accent font-black uppercase tracking-[0.2em]">{currentModule.label} node active</span>
               </div>
            </div>
            <div className="flex items-center gap-8">
               <div className="hidden xl:flex items-center gap-6 mr-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <Shield className="w-4 h-4" />
                     </div>
                     <div>
                        <span className="block text-[8px] font-black text-slate-300 uppercase tracking-widest">Data Guard</span>
                        <span className="text-[10px] font-bold text-slate-500">Encrypted</span>
                     </div>
                  </div>
                  <div className="w-px h-10 bg-slate-100"></div>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <Globe className="w-4 h-4" />
                     </div>
                     <div>
                        <span className="block text-[8px] font-black text-slate-300 uppercase tracking-widest">Market Feed</span>
                        <span className="text-[10px] font-bold text-slate-500">Localized</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Operational</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <button className="relative w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm group">
                        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-accent border-2 border-white"></span>
                     </button>
                     <div className="w-12 h-12 rounded-2xl border-2 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center text-slate-300 hover:border-accent hover:text-accent transition-all cursor-pointer shadow-sm">
                        <User className="w-6 h-6" />
                     </div>
                  </div>
               </div>
            </div>
         </header>

         {/* Scrollable View Area */}
         <div className="flex-1 overflow-y-auto p-4 sm:p-12 relative z-0 custom-scrollbar scroll-smooth">
            <div className="max-w-7xl mx-auto pb-16">
               <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                     <Route path="/dashboard" element={<DashboardAnalytics business={businessData} />} />
                     <Route path="/simulator" element={<WhatIfSimulator />} />
                     <Route path="/assistant" element={<AiAssistant />} />
                     <Route path="/subsidy" element={<SubsidyChecker />} />
                     <Route path="/documents" element={<DocumentAutomation />} />
                     <Route path="*" element={<DashboardAnalytics business={businessData} />} />
                  </Routes>
               </AnimatePresence>
            </div>
         </div>
      </main>
    </div>
  )
}

export default MainApp
