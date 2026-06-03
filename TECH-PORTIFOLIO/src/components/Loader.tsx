import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LogoMark from './LogoMark'

export default function Loader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 1600)
    const t2 = setTimeout(() => setPhase('exit'), 2200)
    const t3 = setTimeout(onDone, 2750)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  // SVG circle for the progress ring — wraps around the logo
  const R = 58          // radius of ring
  const CIRC = 2 * Math.PI * R  // ≈ 364

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6"
          style={{ background: 'var(--bg)' }}
          role="status"
          aria-label="Loading"
        >
          {/* dot-grid backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              opacity: 0.4,
            }}
            aria-hidden="true"
          />

          {/* ambient glow */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 240, height: 240, background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(40px)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />

          {/* Logo + progress ring wrapper */}
          <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>

            {/* spinning progress ring */}
            <svg
              className="absolute inset-0"
              width="140"
              height="140"
              viewBox="0 0 140 140"
              style={{ transform: 'rotate(-90deg)' }}
              aria-hidden="true"
            >
              {/* track */}
              <circle
                cx="70" cy="70" r={R}
                fill="none"
                stroke="var(--border)"
                strokeWidth="2"
              />
              {/* animated fill */}
              <motion.circle
                cx="70" cy="70" r={R}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </svg>

            {/* secondary accent arc — counter spin */}
            <svg
              className="absolute inset-0"
              width="140"
              height="140"
              viewBox="0 0 140 140"
              aria-hidden="true"
            >
              <motion.circle
                cx="70" cy="70" r={R - 8}
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray={`${CIRC * 0.25} ${CIRC}`}
                animate={{ rotate: [0, 360] }}
                style={{ transformOrigin: '70px 70px' }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                opacity={0.5}
              />
            </svg>

            {/* logo — scale-in then slow pulse */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: [1, 1.06, 1] }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
              }}
              className="relative z-10"
            >
              <LogoMark size={72} />
            </motion.div>

            {/* shimmer sweep over the logo */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
              aria-hidden="true"
              style={{ borderRadius: '50%' }}
            >
              <motion.div
                initial={{ x: '-100%', opacity: 0.6 }}
                animate={{ x: '200%', opacity: 0 }}
                transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  width: '40%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                  transform: 'skewX(-15deg)',
                }}
              />
            </motion.div>
          </div>

          {/* name */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="font-mono text-xs tracking-[0.22em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Eyobed Elias
          </motion.p>

          {/* loading dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {[0, 0.15, 0.3].map((d, i) => (
              <motion.span
                key={i}
                className="rounded-full"
                style={{ width: 4, height: 4, background: 'var(--primary)' }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: d }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
