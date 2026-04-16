import React from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, SlidersHorizontal, MessageSquare, ShieldCheck, FileText, Bell, LogOut, Globe } from 'lucide-react'
import useStore from '../store/useStore'

// Import Components
import DashboardAnalytics from '../components/DashboardAnalytics'
import WhatIfSimulator from '../components/WhatIfSimulator'
import AiAssistant from '../components/AiAssistant'
import SubsidyChecker from '../components/SubsidyChecker'
import DocumentAutomation from '../components/DocumentAutomation'
import LiveDataPulse from '../components/LiveDataPulse'

const MainApp = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useStore((state) => state.logout)
  const businessData = useStore((state) => state.businessData)

  const navItems = [
    { path: '/dashboard', label: 'Control Center', icon: LayoutDashboard },
    { path: '/simulator', label: 'What-If Simulator', icon: SlidersHorizontal },
    { path: '/assistant', label: 'AI Assistant', icon: MessageSquare },
    { path: '/subsidy', label: 'Subsidy Matcher', icon: ShieldCheck },
    { path: '/documents', label: 'Doc Automation', icon: FileText },
  ]

  const currentModule = navItems.find(item => item.path === location.pathname) || navItems[0]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Sidebar Layout */}
      <aside className="w-72 bg-background-surface border-r border-white/5 flex flex-col z-20">
         <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3">
            <img src="/logo.png" alt="EcoPulse Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-display font-bold">EcoPulse</span>
         </div>
         
         <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-3 mb-4">Core Modules</p>
            {navItems.map((item) => (
               <Link
                 key={item.path}
                 to={item.path}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${location.pathname === item.path ? 'text-white' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
               >
                 <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                 <span className="font-medium text-sm">{item.label}</span>
                 {location.pathname === item.path && (
                    <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl" transition={{ type: 'spring', bounce: 0.2 }} />
                 )}
               </Link>
            ))}
         </div>

         {/* User & Settings Block */}
         <div className="p-4 border-t border-white/5 space-y-2">
            <div className="bg-background-layered p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-left">
               <span className="text-sm font-bold text-white truncate">{businessData?.name || 'Administrator'}</span>
               <span className="text-xs text-primary truncate capitalize flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Active Session
               </span>
            </div>
            <div className="flex gap-2 mt-2">
               <button className="flex-1 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
               </button>
               <button onClick={() => { logout(); navigate('/'); }} className="flex-1 h-10 rounded-lg bg-white/5 hover:bg-destructive/20 hover:text-destructive flex items-center justify-center text-text-muted transition-colors">
                  <LogOut className="w-4 h-4" />
               </button>
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(0,230,118,0.03),transparent_50%)]">
         <LiveDataPulse count={12} />
         
         {/* Top Header */}
         <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background-surface/50 backdrop-blur-md z-10">
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
               {currentModule.label}
            </h1>
            <div className="flex items-center gap-4">
               <button className="relative w-10 h-10 rounded-full bg-background-layered border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-primary shadow-glow-primary"></span>
               </button>
            </div>
         </header>

         {/* Scrollable View Area */}
         <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-0">
            <div className="max-w-6xl mx-auto pb-10">
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
