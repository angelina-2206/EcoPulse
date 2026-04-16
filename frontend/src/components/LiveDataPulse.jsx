import React from 'react'
import { motion } from 'framer-motion'

const LiveDataPulse = ({ count = 15 }) => {
  const dots = Array.from({ length: count })

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {dots.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#00E676]"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            opacity: [0, 0.4, 0],
            scale: [0, 1.2, 0],
            x: [null, (Math.random() - 0.5) * 200 + "%"],
            y: [null, (Math.random() - 0.5) * 200 + "%"]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

export default LiveDataPulse
