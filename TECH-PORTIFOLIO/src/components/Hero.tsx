import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, Mail, Code2, ExternalLink, Lock, Shield } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './SocialIcons'
import LogoMark from './LogoMark'
import type { Profile } from '../types'

interface Props { profile: Profile | null }

const ROLES = ['Software Developer', 'Security Engineer', 'CTO & Tech Lead', 'Detection Engineer']

function useRoleCycle() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ROLES.length), 3000)
    return () => clearInterval(t)
  }, [])
  return ROLES[idx]
}

// ── Orbiting skill chip ───────────────────────────────────────────────────────
function OrbitChip({
  label,
  color,
  radius,
  startAngle: angle,  duration,
  size = 28,
  delay = 0,
}: {
  label: string
  color: string
  radius: number
  angle: number
  duration: number
  size?: number
  delay?: number
}) {
  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        width: 0,
        height: 0,
        top: '50%',
        left: '50%',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      {/* arm */}
      <motion.div
        style={{
          position: 'absolute',
          transformOrigin: '0 0',
          transform: `rotate(${angle}deg) translateX(${radius}px)`,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.4, ease: 'easeOut' }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
          style={{
            background: color + '18',
            color,
            border: `1px solid ${color}40`,
            backdropFilter: 'blur(8px)',
            boxShadow: `0 4px 16px ${color}20`,
            transform: 'translate(-50%, -50%)',
          }}
          whileHover={{ scale: 1.12, boxShadow: `0 6px 24px ${color}40` }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
          {label}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ── Floating stat card ────────────────────────────────────────────────────────
function FloatCard({
  value,
  label,
  color,
  x,
  y,
  delay,
}: {
  value: string
  label: string
  color: string
  x: string
  y: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="absolute flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        left: x,
        top: y,
        background: 'var(--surface)',
        border: `1px solid ${color}30`,
        boxShadow: `0 8px 32px ${color}15`,
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        minWidth: '130px',
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{ background: color + '18' }}
      >
        <span className="text-lg font-black" style={{ color, letterSpacing: '-0.04em' }}>{value}</span>
      </div>
      <span className="text-xs font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </motion.div>
  )
}

// ── Visual panel ──────────────────────────────────────────────────────────────
function HeroVisual({ profile, mounted }: { profile: Profile | null; mounted: boolean }) {
  if (!mounted) return null

  const ORBIT_1 = [
    { label: 'React.js',    color: '#61dafb', angle: 0,   duration: 18, delay: 0 },
    { label: 'TypeScript',  color: '#3178c6', angle: 120, duration: 18, delay: 0 },
    { label: 'Node.js',     color: '#539e43', angle: 240, duration: 18, delay: 0 },
  ]
  const ORBIT_2 = [
    { label: 'Security',    color: '#ef4444', angle: 60,  duration: 26, delay: 0.3 },
    { label: 'Docker',      color: '#2496ed', angle: 150, duration: 26, delay: 0.3 },
    { label: 'AWS',         color: '#ff9900', angle: 240, duration: 26, delay: 0.3 },
    { label: 'PostgreSQL',  color: '#336791', angle: 330, duration: 26, delay: 0.3 },
  ]

  return (
    <div className="relative flex items-center justify-center" style={{ height: '480px' }}>

      {/* Faint orbit rings */}
      {[140, 210].map((r, i) => (
        <div
          key={r}
          className="absolute rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            width: r * 2, height: r * 2,
            border: `1px dashed var(--border)`,
            opacity: i === 0 ? 0.5 : 0.3,
          }}
        />
      ))}

      {/* Outer glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          width: 300, height: 300,
          background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)',
          filter: 'blur(32px)',
        }}
      />

      {/* Inner orbit chips */}
      {ORBIT_1.map(o => (
        <OrbitChip key={o.label} {...o} radius={140} size={28} />
      ))}

      {/* Outer orbit chips */}
      {ORBIT_2.map(o => (
        <OrbitChip key={o.label} {...o} radius={210} size={26} />
      ))}

      {/* Center avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex items-center justify-center"
        style={{
          width: 130, height: 130,
          borderRadius: '50%',
          background: 'var(--surface)',
          border: '3px solid var(--primary)',
          boxShadow: '0 0 48px var(--glow)',
          overflow: 'hidden',
        }}
      >
        {profile?.aboutImage ? (
          <img
            src={profile.aboutImage}
            alt="Eyobed Elias"
            className="w-full h-full object-cover"
          />
        ) : (
          <LogoMark size={56} />
        )}
      </motion.div>

      {/* Pulsing ring around avatar */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ width: 150, height: 150, border: '1px solid var(--primary)', borderRadius: '50%' }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ width: 150, height: 150, border: '1px solid var(--secondary)', borderRadius: '50%' }}
        animate={{ scale: [1, 1.32, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />

      {/* Floating stat cards */}
      <FloatCard value="4+"  label="Years Experience" color="#3b82f6" x="-20px"   y="20px"  delay={0.8} />
      <FloatCard value="15+" label="Projects Shipped"  color="#10b981" x="55%"    y="10px"  delay={1.0} />
      <FloatCard value="3"   label="Active Roles"      color="#8b5cf6" x="10%"    y="78%"   delay={1.2} />

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium"
        style={{
          right: '0px', bottom: '10%',
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.3)',
          color: '#10b981',
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#10b981', display: 'inline-block' }}
        />
        Available
      </motion.div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Hero({ profile }: Props) {
  const role = useRoleCycle()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
  const item = {
    hidden:  { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  }

  const socialLinks = [
    { href: profile?.github   || 'https://github.com/eyobed101',               icon: <GithubIcon size={17} />,   label: 'GitHub'   },
    { href: profile?.linkedin || 'https://linkedin.com/in/eyobed-e-61b39b194', icon: <LinkedinIcon size={17} />, label: 'LinkedIn' },
    { href: `mailto:${profile?.email || 'eyobedeliast@gmail.com'}`,            icon: <Mail size={17} />,         label: 'Email'    },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
        }}
      />

      {/* glow orbs */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: '15%', left: '5%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)', filter: 'blur(48px)' }} />
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ bottom: '10%', right: '8%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)', filter: 'blur(48px)' }} />

      <div className="container relative z-10 pt-24 md:pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left: text ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            className="flex flex-col"
          >
            <motion.div variants={item} className="flex items-center gap-3 mb-5">
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
                style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1 variants={item} className="font-extrabold leading-none mb-4"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: 'var(--text)', letterSpacing: '-0.03em' }}>
              {profile?.name || 'Eyobed Elias'}
            </motion.h1>

            <motion.div variants={item} className="mb-5 h-9 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={role}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-bold"
                  style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', color: 'var(--text-muted)', letterSpacing: '-0.01em' }}
                >
                  {role}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p variants={item} className="text-base leading-relaxed mb-7 max-w-lg" style={{ color: 'var(--text-muted)' }}>
              {profile?.description || "Building secure, scalable systems across multiple platforms. Leading technical innovation at Tripways while contributing to national cybersecurity at INSA."}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-2.5 mb-8">
              {[
                { icon: <Code2 size={13} />,  label: 'Full Stack Dev',    color: '#3b82f6' },
                { icon: <Shield size={13} />, label: 'Security Engineer', color: '#10b981' },
                { icon: <Lock size={13} />,   label: 'Threat Hunter',     color: '#f59e0b' },
              ].map(({ icon, label, color }) => (
                <span key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: color + '12', color, border: `1px solid ${color}30` }}>
                  {icon} {label}
                </span>
              ))}
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-3 mb-9">
              <a href="#work" onClick={e => { e.preventDefault(); document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-primary">
                View My Work <ExternalLink size={15} />
              </a>
              <a href="#contact" onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-outline">
                Get In Touch
              </a>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-3">
              {socialLinks.map(({ href, icon, label }) => (
                <a key={label} href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {icon}
                </a>
              ))}
              <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
              <a href="https://endpoint.eyobedelias.net.et/uploads/1777320343874-114031482.pdf"
                target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium hover-underline"
                style={{ color: 'var(--text-muted)' }}>
                Resume ↗
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right: orbit visual ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:flex items-center justify-center"
          >
            <HeroVisual profile={profile} mounted={mounted} />
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="flex flex-col items-center gap-1.5 mt-14" aria-hidden="true">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown size={17} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          </motion.div>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>scroll</span>
        </motion.div>
      </div>
    </section>
  )
}
