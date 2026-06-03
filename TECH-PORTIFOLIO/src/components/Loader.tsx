import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'draw' | 'hold' | 'exit'>('draw')

  useEffect(() => {
    // draw hex stroke → hold briefly → exit
    const t1 = setTimeout(() => setPhase('hold'), 1400)
    const t2 = setTimeout(() => setPhase('exit'), 2000)
    const t3 = setTimeout(onDone, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  // Hexagon perimeter ≈ 264 for a 44-unit radius flat-top hex in 100×100 viewBox
  const HEX_PERIMETER = 264

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'var(--bg)' }}
          aria-label="Loading"
          role="status"
        >
          {/* subtle dot-grid bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              opacity: 0.5,
            }}
            aria-hidden="true"
          />

          {/* ambient glow behind logo */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 200, height: 200,
              background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)',
              filter: 'blur(32px)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />

          {/* logo SVG with animated stroke draw */}
          <motion.svg
            width="96"
            height="96"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* animated hex outline */}
            <motion.polygon
              points="50,6 94,28 94,72 50,94 6,72 6,28"
              stroke="var(--primary)"
              strokeWidth="5"
              fill="none"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              style={{
                strokeDasharray: HEX_PERIMETER,
                strokeDashoffset: HEX_PERIMETER,
              }}
            />

            {/* E — fades in after hex is drawn */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.35, ease: 'easeOut' }}
              style={{ originX: '50px', originY: '50px' }}
            >
              <rect x="35" y="30" width="7"  height="40" rx="2" fill="var(--primary)" />
              <rect x="35" y="30" width="28" height="7"  rx="2" fill="var(--primary)" />
              <rect x="35" y="46.5" width="22" height="7" rx="2" fill="var(--primary)" />
              <rect x="35" y="63" width="28" height="7"  rx="2" fill="var(--primary)" />
            </motion.g>
          </motion.svg>

          {/* name fade-in below */}
          <motion.p
            className="absolute font-mono text-xs tracking-widest"
            style={{ color: 'var(--text-muted)', top: 'calc(50% + 60px)', letterSpacing: '0.2em' }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            EYOBED ELIAS
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
