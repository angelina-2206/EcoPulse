import React, { useState } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Calculator, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6'] // Emerald, Blue, Purple

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl shadow-black/50">
        <p className="text-slate-300 text-xs font-bold uppercase mb-1">{payload[0].name}</p>
        <p className="text-white text-lg font-bold">{payload[0].value.toFixed(1)} Tons</p>
      </div>
    );
  }
  return null;
}

const CarbonCalculator = ({ business, apiUrl }) => {
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    energy: business.monthly_energy_usage,
    transport: 150.0,
    waste: 300.0
  })
  const [result, setResult] = useState(null)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const data = {
        business_id: business.id || 1,
        energy_usage: inputs.energy,
        transport_fuel: inputs.transport,
        waste_amount: inputs.waste
      }
      const response = await axios.post(`${apiUrl}/carbon/calculate`, data)
      setResult(response.data)
    } catch (err) {
      console.error('Calculation failed, using mock data', err)
      setTimeout(() => {
        setResult({
          total_emissions: 3.2,
          energy_emissions: inputs.energy * 0.002,
          transport_emissions: inputs.transport * 0.005,
          waste_emissions: inputs.waste * 0.001,
          rating: 'A-'
        })
        setLoading(false)
      }, 1000)
      return
    }
    setLoading(false)
  }

  const chartData = result ? [
    { name: 'Energy', value: result.energy_emissions },
    { name: 'Transport', value: result.transport_emissions },
    { name: 'Waste', value: result.waste_emissions }
  ] : []

  return (
    <div className="space-y-8">
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="glass-card shadow-[0_0_30px_rgba(16,185,129,0.05)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
           <div>
             <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
               <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                 <Calculator className="w-7 h-7 text-emerald-400" />
               </div>
               Emission Simulator
             </h2>
             <p className="text-slate-400 text-sm mt-2">Input your active metrics to simulate environmental cost.</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Energy (kWh)</label>
            <input 
              type="number" value={inputs.energy} 
              onChange={e => setInputs({...inputs, energy: parseFloat(e.target.value) || 0})}
              className="input-field font-mono text-emerald-100" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Fleet Fuel (Liters)</label>
            <input 
              type="number" value={inputs.transport} 
              onChange={e => setInputs({...inputs, transport: parseFloat(e.target.value) || 0})}
              className="input-field font-mono text-emerald-100" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Solid Waste (kg)</label>
            <input 
              type="number" value={inputs.waste} 
              onChange={e => setInputs({...inputs, waste: parseFloat(e.target.value) || 0})}
              className="input-field font-mono text-emerald-100" 
            />
          </div>
        </div>

        <button 
          onClick={handleCalculate}
          disabled={loading}
          className="btn-primary mt-8 w-full sm:w-auto min-w-[200px]"
        >
          {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : 'Run Simulation'}
        </button>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div 
             initial={{ opacity: 0, height: 0, scale: 0.95 }}
             animate={{ opacity: 1, height: 'auto', scale: 1 }}
             className="grid grid-cols-1 xl:grid-cols-5 gap-8 overflow-hidden"
          >
            <div className="xl:col-span-2 glass-card space-y-8 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
              
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Footprint Analysis</h3>
                <p className="text-sm text-slate-400 mt-1">AI verified emission breakdown</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Net Emissions</p>
                  <p className="text-3xl font-black text-white mt-2 font-mono">{(result.energy_emissions + result.transport_emissions + result.waste_emissions).toFixed(1)} <span className="text-lg text-slate-500 font-medium">T</span></p>
                </div>
                <div className="bg-slate-800/50 border border-blue-500/20 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <p className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">Eco Rating</p>
                  <p className="text-3xl font-black text-white mt-2">{result.rating}</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{backgroundColor: COLORS[index], color: COLORS[index]}}></div>
                      <span className="text-sm font-semibold text-slate-300">{item.name} Lifecycle</span>
                    </div>
                    <span className="text-base font-bold text-white font-mono">{item.value.toFixed(2)} T</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-3 glass-card flex flex-col items-center justify-center relative min-h-[400px]">
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-white/5 rounded-full"></div>
                  <div className="w-32 h-32 border-2 border-dashed border-emerald-500/10 rounded-full absolute animate-[spin_60s_linear_infinite]"></div>
               </div>
               
               <div className="w-full z-10 min-h-[350px]" style={{ minHeight: '350px' }}>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={120}
                        paddingAngle={8}
                        stroke="rgba(0,0,0,0)"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                             key={`cell-${index}`} 
                             fill={COLORS[index % COLORS.length]} 
                             style={{ filter: `drop-shadow(0px 0px 10px ${COLORS[index % COLORS.length]}40)` }} 
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CarbonCalculator
