import React from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, SlidersHorizontal, MessageSquare, ShieldCheck, FileText, Bell, LogOut, Globe, Settings, User, CreditCard, ChevronRight } from 'lucide-react'
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
         <div className="h-24 flex items-center px-8 gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
               <img src={logo} alt="EcoPulse" className="w-full h-full object-contain" />
            </div>
            <div>
               <div className="text-2xl font-display font-bold text-white tracking-tight">EcoPulse</div>
               <div className="text-[10px] font-bold text-accent uppercase tracking-widest opacity-80">Enterprise AI</div>
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto py-10 px-6 space-y-1">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-4 mb-4">Platform Solutions</p>
            {navItems.map((item) => (
               <Link
                 key={item.path}
                 to={item.path}
                 className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 relative group ${location.pathname === item.path ? 'bg-white text-primary shadow-xl' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
               >
                 <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-accent' : 'group-hover:text-accent transition-colors'}`} />
                 <span className="font-semibold text-sm">{item.label}</span>
                 {location.pathname === item.path && (
                    <motion.div layoutId="sidebar-active" className="absolute right-4 w-1.5 h-1.5 bg-accent rounded-full" transition={{ type: 'spring', bounce: 0.2 }} />
                 )}
               </Link>
            ))}

            <div className="mt-12 pt-12 border-t border-white/5">
               <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-4 mb-4">Enterprise Hub</p>
               <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold text-sm">Billing</span>
               </button>
               <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
                  <Settings className="w-5 h-5" />
                  <span className="font-semibold text-sm">Integrations</span>
               </button>
            </div>
         </div>

         {/* User Block */}
         <div className="p-8 border-t border-white/5 bg-primary-dark/30">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">
                     {businessData?.name?.[0] || 'A'}
                  </div>
                  <div className="flex flex-col overflow-hidden max-w-[120px]">
                     <span className="text-sm font-bold text-white truncate">{businessData?.name || 'Administrator'}</span>
                     <span className="text-[10px] text-accent font-bold uppercase tracking-widest truncate">{businessData?.industry || 'Global Group'}</span>
                  </div>
               </div>
               <button onClick={() => { logout(); navigate('/'); }} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut className="w-4 h-4" />
               </button>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all">
               <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Enterprise Plan</span>
                  <span className="text-xs text-white font-bold">Manage Account</span>
               </div>
               <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50">
         
         {/* Top Header - Modern Corporate Style */}
         <header className="h-24 border-b border-slate-200 flex items-center justify-between px-12 bg-white/95 backdrop-blur-md z-10 shadow-sm">
            <div className="flex flex-col">
               <h1 className="text-3xl font-display font-bold text-primary tracking-tight">
                  {currentModule.label}
               </h1>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">ECOPULSE INTELLIGENCE</span>
                  <span className="text-[10px] text-slate-300 font-bold">/</span>
                  <span className="text-[10px] text-accent font-bold uppercase tracking-widest">{currentModule.label}</span>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live System Status</span>
               </div>
               <div className="flex items-center gap-3">
                  <button className="relative w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                     <Bell className="w-5 h-5" />
                     <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-accent border-2 border-white"></span>
                  </button>
                  <button className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center text-slate-400 hover:border-primary transition-all shadow-sm">
                     <User className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </header>

         {/* Scrollable View Area */}
         <div className="flex-1 overflow-y-auto p-4 sm:p-12 relative z-0 custom-scrollbar">
            <div className="max-w-7xl mx-auto pb-10">
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
