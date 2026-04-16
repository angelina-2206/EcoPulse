import React, { useState } from 'react'
import { Upload, CheckCircle, Search, FileUp, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const BillScanner = () => {
  const [file, setFile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const handleUpload = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setResult(null)
    }
  }

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      setResult({
        usage: '842',
        unit: 'kWh',
        cost: '$118.50',
        period: 'Aug 2024',
        anomaly: 'Standby drain detected (+5%)'
      })
      setScanning(false)
    }, 2500)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="glass-card text-center space-y-8 py-16 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] flex items-center justify-center mx-auto border border-white/10 shadow-2xl shadow-blue-500/20 group hover:border-blue-500/50 transition-colors">
          <FileUp className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
          {scanning && (
            <div className="absolute inset-0 border-2 border-blue-500 rounded-[32px] border-t-transparent animate-spin"></div>
          )}
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Cognitive Bill Processing</h2>
          <p className="text-slate-400 mt-2 text-lg max-w-md mx-auto">Deploy OCR models to extract baseline metrics and detect anomalies directly from utility invoices.</p>
        </div>

        <div className="pt-4 relative z-10 flex flex-col items-center">
          <input 
            type="file" id="bill-upload" className="hidden" 
            accept=".pdf,image/*" onChange={handleUpload} 
          />
          <label 
            htmlFor="bill-upload"
            className={`cursor-pointer inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
              file 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {file ? <CheckCircle className="w-5 h-5" /> : <Upload className="w-5 h-5 opacity-70" />}
            {file ? <span className="font-mono">{file.name}</span> : 'Select Document (PDF/IMG)'}
          </label>
        </div>

        <AnimatePresence>
          {file && !result && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="pt-6 relative z-10"
            >
              <button 
                onClick={handleScan}
                disabled={scanning}
                className="btn-primary w-full max-w-sm mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                {scanning ? (
                  <span className="flex items-center gap-3 relative">
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                     Analyzing Structrue...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                     <Search className="w-5 h-5" /> Initialize Parse Engine
                  </span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div 
             initial={{ opacity: 0, y: 30, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ type: "spring", stiffness: 200, damping: 20 }}
             className="glass-card overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
             
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Structured Output</h3>
                    <p className="text-sm text-slate-400">Data successfully extracted with 98.4% confidence.</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-blue-400" />
                   <span className="text-xs font-bold text-blue-400 tracking-wider">AI VERIFIED</span>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-900/50 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Net Load</p>
                  <p className="text-3xl font-black text-white font-mono">{result.usage} <span className="text-sm text-slate-400 tracking-normal">{result.unit}</span></p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Liability</p>
                  <p className="text-3xl font-black text-emerald-400 font-mono">{result.cost}</p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cycle</p>
                  <p className="text-xl font-bold text-white mt-1 pt-0.5">{result.period}</p>
                </div>
                <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl relative overflow-hidden">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">AI Alert</p>
                  <p className="text-sm font-semibold text-amber-200 mt-1 leading-snug">{result.anomaly}</p>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-white/5 mx-2">
                <button className="w-full btn-secondary py-4 text-emerald-400 hover:text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all">
                  Sync Telemetry to Dashboard
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BillScanner
