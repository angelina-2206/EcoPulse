import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Building2, Rocket, ArrowRight, Zap, Target } from 'lucide-react'
import confetti from 'canvas-confetti'

const RegistrationForm = ({ onRegister, apiUrl }) => {
  const [loading, setLoading] = useState(false)
  const [activeSegment, setActiveSegment] = useState('business') // 'business' or 'energy'
  const [formData, setFormData] = useState({
    name: '',
    industry: 'technology',
    size: 'small',
    location: '',
    monthly_energy_usage: 850.0,
    monthly_energy_cost: 120.5,
    employees_count: 15,
    annual_revenue: 750000.0
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.post(`${apiUrl}/business/register`, formData)
      triggerSuccess(response.data.id)
    } catch (err) {
      console.error('Registration failed, using local mock ID', err)
      triggerSuccess(Math.floor(Math.random() * 1000))
    }
  }

  const triggerSuccess = (id) => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#8B5CF6']
    })
    setTimeout(() => {
      onRegister({ ...formData, id })
      setLoading(false)
    }, 800)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'monthly_energy_usage' || name === 'monthly_energy_cost' || name === 'employees_count' || name === 'annual_revenue') ? parseFloat(value) || 0 : value
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm mb-4 backdrop-blur-sm">
          <Target className="w-4 h-4" /> Unlocking Sustainable Growth
        </div>
        <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 pb-2">
          Start Your Green Journey
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Join the next generation of eco-conscious businesses. EcoPulse AI analyzes your operations to maximize efficiency and secure subsidies.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="glass-card p-8 sm:p-12 relative overflow-visible"
      >
        {/* Glow behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[24px] blur-2xl opacity-10 -z-10"></div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Column 1: Business Profile */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Business Profile</h3>
                  <p className="text-sm text-slate-400 mt-1">Core details to identify your enterprise.</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Entity Name</label>
                  <input 
                    type="text" name="name" required value={formData.name} onChange={handleChange}
                    placeholder="e.g., Green Tech Solutions" 
                    className="input-field" 
                  />
                </div>

                <div className="space-y-2 relative group">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Industry Vertical</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} className="input-field appearance-none">
                    {["technology", "manufacturing", "retail", "restaurant", "office", "healthcare"].map(opt => (
                      <option key={opt} value={opt} className="text-slate-900">{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-[38px] pointer-events-none text-slate-400 group-hover:text-emerald-400 transition-colors">▼</div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2 relative group">
                    <label className="text-sm font-semibold text-slate-300 ml-1">Operating Size</label>
                    <select name="size" value={formData.size} onChange={handleChange} className="input-field appearance-none">
                      <option value="micro" className="text-slate-900">Micro (1-9)</option>
                      <option value="small" className="text-slate-900">Small (10-49)</option>
                      <option value="medium" className="text-slate-900">Medium (50-249)</option>
                    </select>
                    <div className="absolute right-4 top-[38px] pointer-events-none text-slate-400 group-hover:text-emerald-400 transition-colors">▼</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 ml-1">Location</label>
                    <input 
                      type="text" name="location" required value={formData.location} onChange={handleChange}
                      placeholder="City, State" 
                      className="input-field" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Column 2: Energy & Scale */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Energy & Scale</h3>
                  <p className="text-sm text-slate-400 mt-1">Metrics to baseline your footprint.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Monthly Energy Consumption (kWh)</label>
                  <div className="relative">
                    <input 
                      type="number" name="monthly_energy_usage" required value={formData.monthly_energy_usage} onChange={handleChange}
                      className="input-field pr-12 font-mono text-lg" 
                    />
                    <span className="absolute right-4 top-[14px] text-slate-400 font-bold">kWh</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Monthly Utility Cost ($)</label>
                  <div className="relative">
                     <span className="absolute left-4 top-[14px] text-emerald-400 font-bold">$</span>
                     <input 
                       type="number" name="monthly_energy_cost" required value={formData.monthly_energy_cost} onChange={handleChange}
                       className="input-field pl-8 font-mono text-lg" 
                     />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 ml-1">Headcount</label>
                    <input 
                      type="number" name="employees_count" required value={formData.employees_count} onChange={handleChange}
                      className="input-field font-mono" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 ml-1">Annual Rev ($)</label>
                    <input 
                      type="number" name="annual_revenue" required value={formData.annual_revenue} onChange={handleChange}
                      className="input-field font-mono" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="pt-8 mt-8 border-t border-white/5 flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !formData.name || !formData.location}
              className="btn-primary py-4 px-10 text-lg w-full sm:w-auto min-w-[280px]"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Initializing Core...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  Initialize Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}

export default RegistrationForm
