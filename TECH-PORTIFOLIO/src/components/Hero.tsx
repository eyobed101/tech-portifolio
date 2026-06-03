import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Code2, ExternalLink, Lock, Shield } from 'lucide-react'
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

// ── Single orbit ring with evenly distributed chips ───────────────────────────
function OrbitRing({
  skills,
  radius,
  duration,
  ccw = false,
  entryDelay = 0,
}: {
  skills: { label: string; color: string }[]
  radius: number
  duration: number
  ccw?: boolean
  entryDelay?: number
}) {
  const count = skills.length
  const size = radius * 2

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
        top: '50%',
        left: '50%',
        marginTop: -radius,
        marginLeft: -radius,
      }}
      animate={{ rotate: ccw ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {skills.map(({ label, color }, i) => {
        const angleDeg = (i / count) * 360 - 90
        const rad = (angleDeg * Math.PI) / 180
        const cx = radius + radius * Math.cos(rad)
        const cy = radius + radius * Math.sin(rad)

        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: entryDelay + i * 0.07, duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* counter-rotate so label stays upright */}
            <motion.div
              animate={{ rotate: ccw ? 360 : -360 }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap select-none"
                style={{
                  background: 'var(--surface)',
                  color,
                  border: `1px solid ${color}45`,
                  boxShadow: `0 2px 10px ${color}22`,
                  cursor: 'default',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                {label}
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ── Visual panel ──────────────────────────────────────────────────────────────
function HeroVisual({ profile, mounted }: { profile: Profile | null; mounted: boolean }) {
  if (!mounted) return null

  const RING_1 = [
    { label: 'React.js',    color: '#61dafb' },
    { label: 'TypeScript',  color: '#3178c6' },
    { label: 'Node.js',     color: '#539e43' },
    { label: 'Python',      color: '#f59e0b' },
  ]
  const RING_2 = [
    { label: 'Next.js',     color: '#94a3b8' },
    { label: 'Laravel',     color: '#ef4444' },
    { label: 'Docker',      color: '#2496ed' },
    { label: 'MongoDB',     color: '#47a248' },
    { label: 'JWT / OAuth', color: '#8b5cf6' },
  ]
  const RING_3 = [
    { label: 'AWS',          color: '#ff9900' },
    { label: 'PostgreSQL',   color: '#336791' },
    { label: 'Socket.IO',    color: '#010101' },
    { label: 'Threat Hunt',  color: '#06b6d4' },
    { label: 'Redis',        color: '#dc2626' },
    { label: 'CI / CD',      color: '#10b981' },
  ]

  const RADII  = [100, 170, 240]
  const RINGS  = [RING_1, RING_2, RING_3]
  const W      = RADII[2] * 2 + 120   // 600px — fits all chips
  const H      = W

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: W, height: H }}
    >
      {/* central glow */}
      <div className="absolute rounded-full pointer-events-none" aria-hidden="true"
        style={{ width: 220, height: 220, background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* dashed guide rings */}
      {RADII.map(r => (
        <div key={r} className="absolute rounded-full pointer-events-none" aria-hidden="true"
          style={{ width: r * 2, height: r * 2, border: '1px dashed var(--border)', opacity: 0.22 }} />
      ))}

      {/* orbit rings */}
      {RINGS.map((ring, i) => (
        <OrbitRing
          key={i}
          skills={ring}
          radius={RADII[i]}
          duration={18 + i * 10}
          ccw={i % 2 !== 0}
          entryDelay={0.4 + i * 0.35}
        />
      ))}

      {/* center avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10"
        style={{
          width: 100, height: 100,
          borderRadius: '50%',
          background: 'var(--surface)',
          border: '3px solid var(--primary)',
          boxShadow: '0 0 48px var(--glow)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {profile?.aboutImage ? (
          <img src={profile.aboutImage} alt="Eyobed Elias" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <LogoMark size={44} />
          </div>
        )}
      </motion.div>

      {/* pulse rings */}
      {[0, 0.8].map((d, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none" aria-hidden="true"
          style={{ width: 116, height: 116, border: `1.5px solid ${i === 0 ? 'var(--primary)' : 'var(--secondary)'}`, borderRadius: '50%' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: d }}
        />
      ))}
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
      {/* dot grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.6 }} />

      {/* glow orbs */}
      <div aria-hidden="true" className="absolute pointer-events-none"
        style={{ top: '15%', left: '5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)', filter: 'blur(48px)' }} />
      <div aria-hidden="true" className="absolute pointer-events-none"
        style={{ bottom: '10%', right: '8%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)', filter: 'blur(48px)' }} />

      <div className="container relative z-10 pt-24 md:pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left text ── */}
          <motion.div variants={stagger} initial="hidden" animate={mounted ? 'visible' : 'hidden'} className="flex flex-col">
            <motion.div variants={item} className="flex items-center gap-3 mb-5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
                style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', border: '1px solid rgba(59,130,246,0.2)' }}>
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
                <motion.p key={role}
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-bold"
                  style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', color: 'var(--text-muted)', letterSpacing: '-0.01em' }}>
                  {role}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p variants={item} className="text-base leading-relaxed mb-7 max-w-lg" style={{ color: 'var(--text-muted)' }}>
              {profile?.description || 'Building secure, scalable systems across multiple platforms. Leading technical innovation at Tripways while contributing to national cybersecurity at INSA.'}
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
            className="hidden lg:flex items-center justify-center overflow-visible"
          >
            <HeroVisual profile={profile} mounted={mounted} />
          </motion.div>
        </div>

        {/* removed scroll indicator */}
      </div>
    </section>
  )
}
