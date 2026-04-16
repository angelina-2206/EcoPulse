import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, BarChart3, Lightbulb, ScanLine, RotateCcw } from 'lucide-react'
import RegistrationForm from './components/RegistrationForm'
import Dashboard from './components/Dashboard'
import CarbonCalculator from './components/CarbonCalculator'
import ActionPlan from './components/ActionPlan'
import BillScanner from './components/BillScanner'

const API_BASE_URL = 'http://localhost:8000/api'

function App() {
  const [business, setBusiness] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get('http://localhost:8000/health')
        setBackendStatus('online')
      } catch (err) {
        setBackendStatus('offline')
      }
    }
    checkBackend()
    
    const saved = localStorage.getItem('ecopulse_business')
    if (saved) setBusiness(JSON.parse(saved))
  }, [])

  const handleRegister = (data) => {
    setBusiness(data)
    localStorage.setItem('ecopulse_business', JSON.stringify(data))
  }

  const handleReset = () => {
    localStorage.removeItem('ecopulse_business')
    setBusiness(null)
    setActiveTab('overview')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'carbon', label: 'Carbon Base', icon: Leaf },
    { id: 'action', label: 'Action Plan', icon: Lightbulb },
    { id: 'scan', label: 'Bill Scan', icon: ScanLine }
  ]

  return (
    <div className="min-h-screen flex flex-col text-slate-200">
      <header className="fixed top-0 left-0 right-0 h-20 bg-slate-900/40 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6 sm:px-10 transition-all duration-300">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveTab('overview')}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white brand">EcoPulse</span>
        </motion.div>

        {backendStatus === 'offline' && !business && (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="px-4 py-1.5 bg-red-900/30 text-red-400 border border-red-500/20 rounded-full text-xs font-semibold flex items-center gap-2 backdrop-blur-md"
          >
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
             DEMO MODE
          </motion.div>
        )}

        {business && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{business.name}</p>
              <p className="text-xs text-slate-400 font-medium capitalize">{business.industry}</p>
            </div>
            <button 
              onClick={handleReset}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-red-400 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              title="Reset Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-32 pb-16 px-4 sm:px-8 max-w-[1400px] mx-auto w-full">
        <AnimatePresence mode="wait">
          {!business ? (
            <motion.div 
               key="registration"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
               transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <RegistrationForm onRegister={handleRegister} apiUrl={API_BASE_URL} />
            </motion.div>
          ) : (
            <motion.div 
               key="dashboard-shell"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-10"
            >
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl shadow-xl mx-auto md:mx-0 relative">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 z-10 ${
                      activeTab === tab.id 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-emerald-400' : ''}`} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="active-tab-bg"
                        className="absolute inset-0 bg-white/10 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic Content */}
              <div className="min-h-[600px] relative">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {activeTab === 'overview' && <Dashboard business={business} />}
                      {activeTab === 'carbon' && <CarbonCalculator business={business} apiUrl={API_BASE_URL} />}
                      {activeTab === 'action' && <ActionPlan business={business} apiUrl={API_BASE_URL} />}
                      {activeTab === 'scan' && <BillScanner />}
                    </motion.div>
                 </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-slate-500 font-medium text-sm mt-auto border-t border-white/5">
        &copy; 2026 EcoPulse AI • <span className="text-slate-400">Pioneering MSME Sustainability</span>
      </footer>
    </div>
  )
}

export default App
