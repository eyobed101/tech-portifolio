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

// ── Avatar with outbounding orbit effect ─────────────────────────────────────
function AvatarOrbit({
  profile,
  size,
  mounted,
}: {
  profile: Profile | null
  size: number
  mounted: boolean
}) {
  if (!mounted) return null

  const avatarSize = size
  const pulseDelays = [0, 0.6, 1.2]

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size + 80, height: size + 80 }}
    >
      {/* ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          width: avatarSize + 60,
          height: avatarSize + 60,
          background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)',
          filter: 'blur(28px)',
        }}
      />

      {/* outbounding pulse rings — 3 staggered */}
      {pulseDelays.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            width: avatarSize + 12,
            height: avatarSize + 12,
            border: `${i === 0 ? '2px' : '1px'} solid ${i === 1 ? 'var(--secondary)' : 'var(--primary)'}`,
            borderRadius: '50%',
          }}
          animate={{
            scale: [1, 1.45 + i * 0.15, 1],
            opacity: [0.55, 0, 0.55],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        />
      ))}

      {/* spinning conic border ring */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{
          width: avatarSize + 10,
          height: avatarSize + 10,
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, var(--primary) 0%, var(--secondary) 40%, transparent 60%, var(--primary) 100%)`,
          padding: '2px',
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))`,
        }}
      />

      {/* avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 rounded-full overflow-hidden"
        style={{
          width: avatarSize,
          height: avatarSize,
          border: '3px solid var(--primary)',
          boxShadow: '0 0 40px var(--glow)',
          background: 'var(--surface-2)',
          flexShrink: 0,
        }}
      >
        {profile?.aboutImage ? (
          <img
            src={profile.aboutImage}
            alt="Eyobed Elias"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <LogoMark size={Math.round(avatarSize * 0.45)} />
          </div>
        )}
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

            {/* Mobile avatar — shown only below lg */}
            <motion.div
              variants={item}
              className="flex justify-center mb-8 lg:hidden"
            >
              <AvatarOrbit profile={profile} size={140} mounted={mounted} />
            </motion.div>
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

          {/* ── Right: avatar orbit — desktop only ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.35, ease: 'easeOut' }}
            className="hidden lg:flex items-center justify-center"
          >
            <AvatarOrbit profile={profile} size={280} mounted={mounted} />
          </motion.div>
        </div>

        {/* removed scroll indicator */}
      </div>
    </section>
  )
}
