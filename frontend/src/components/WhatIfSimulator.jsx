import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings2, Zap, Sun, Lightbulb, RefreshCw } from 'lucide-react'

const SliderControl = ({ icon: Icon, label, value, min, max, unit, onChange, colorClass }) => (
  <div className="space-y-4 bg-background-layered border border-white/5 p-5 rounded-xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClass}`}><Icon className="w-5 h-5 text-white" /></div>
        <span className="font-semibold text-white">{label}</span>
      </div>
      <span className="text-xl font-bold font-display">{value}<span className="text-sm text-text-muted ml-1">{unit}</span></span>
    </div>
    <input 
      type="range" min={min} max={max} value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" 
    />
  </div>
)

const WhatIfSimulator = () => {
  const [energyInput, setEnergyInput] = useState(4000)
  const [solarAdoption, setSolarAdoption] = useState(0)
  const [ledAdoption, setLedAdoption] = useState(0)
  
  const [results, setResults] = useState({ cost: 480, carbon: 2.4, savings: 0 })
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    setIsSimulating(true)
    const timeout = setTimeout(() => {
      const baseCost = energyInput * 0.12
      const baseCarbon = energyInput * 0.0006

      const solarOffset = (solarAdoption / 100) * energyInput
      const ledReduction = (ledAdoption / 100) * (energyInput * 0.3) // assume lighting is 30% of energy
      
      const newEnergy = Math.max(0, energyInput - solarOffset - ledReduction)
      const newCost = newEnergy * 0.12
      const newCarbon = newEnergy * 0.0006
      
      setResults({
        cost: newCost, 
        carbon: newCarbon,
        savings: baseCost - newCost
      })
      setIsSimulating(false)
    }, 400) // slight debounce feel
    return () => clearTimeout(timeout)
  }, [energyInput, solarAdoption, ledAdoption])

  return (
    <div className="space-y-8">
      <div className="mb-2">
         <h2 className="text-3xl font-display font-bold text-white tracking-tight">Scenario Simulator</h2>
         <p className="text-text-muted mt-2 text-sm">Model operational changes and forecast financial impact.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders Container */}
        <div className="lg:col-span-7 glass-panel p-6 space-y-6">
           <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
             <Settings2 className="w-5 h-5 text-accent" /> Control Parameters
           </h3>
           
           <SliderControl 
             icon={Zap} label="Monthly Energy Baseline" 
             value={energyInput} min={1000} max={20000} unit="kWh"
             onChange={setEnergyInput} colorClass="bg-blue-500" 
           />
           <SliderControl 
             icon={Sun} label="Solar Roof Coverage" 
             value={solarAdoption} min={0} max={100} unit="%"
             onChange={setSolarAdoption} colorClass="bg-amber-500" 
           />
           <SliderControl 
             icon={Lightbulb} label="LED Fixture Replacement" 
             value={ledAdoption} min={0} max={100} unit="%"
             onChange={setLedAdoption} colorClass="bg-primary" 
           />
        </div>

        {/* Results Container */}
        <div className="lg:col-span-5 space-y-6">
           <div className="glass-panel p-8 h-full flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] transition-transform duration-700 group-hover:scale-125"></div>
              
              <h3 className="text-lg font-bold text-white mb-8 border-b border-white/5 pb-4">Forecasted Output</h3>

              {isSimulating ? (
                 <div className="flex-1 flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                 </div>
              ) : (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 flex-1">
                    <div>
                       <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Projected Monthly Cost</p>
                       <p className="text-5xl font-display font-bold text-white mt-2">${results.cost.toFixed(2)}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-background-layered border border-white/5 rounded-xl p-4">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Carbon Gen</p>
                          <p className="text-2xl font-bold font-display text-white">{results.carbon.toFixed(2)} <span className="text-sm font-medium text-text-muted">T</span></p>
                       </div>
                       <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Total Savings</p>
                          <p className="text-2xl font-bold font-display text-primary">${results.savings.toFixed(2)}</p>
                       </div>
                    </div>
                 </motion.div>
              )}

              <button className="w-full btn-glow mt-8">Apply Blueprint to Action Plan</button>
           </div>
        </div>

      </div>
    </div>
  )
}

export default WhatIfSimulator
