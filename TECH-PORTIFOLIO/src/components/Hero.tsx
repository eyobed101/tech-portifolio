import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, Mail, Shield, Code2, ExternalLink, Terminal, Lock } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './SocialIcons'
import type { Profile } from '../types'

interface Props { profile: Profile | null }

// Cycling roles
const ROLES = ['Software Developer', 'Security Engineer', 'CTO & Tech Lead', 'Detection Engineer']

// Simulated code snippet lines
const CODE_LINES = [
  { token: 'import', rest: ' { SecureAuth } from "@eyobed/auth"',    color: '#c084fc' },
  { token: 'import', rest: ' { APIGateway } from "@eyobed/gateway"', color: '#c084fc' },
  { token: '',       rest: '',                                         color: '' },
  { token: 'const',  rest: ' server = new APIGateway({',             color: '#60a5fa' },
  { token: '',       rest: '  auth: SecureAuth.jwt(),',              color: '#94a3b8' },
  { token: '',       rest: '  rateLimit: 1000,',                     color: '#94a3b8' },
  { token: '',       rest: '  encrypt: true,',                       color: '#94a3b8' },
  { token: '',       rest: '})',                                       color: '#94a3b8' },
  { token: '',       rest: '',                                         color: '' },
  { token: 'server', rest: '.listen(443) // 🔒 secured',             color: '#34d399' },
]

// Simulated security terminal lines
const THREAT_LINES = [
  { label: 'SCAN',  msg: 'Starting network sweep on 10.0.0.0/24',   color: '#94a3b8' },
  { label: 'INFO',  msg: '254 hosts discovered, 12 open ports',      color: '#60a5fa' },
  { label: 'WARN',  msg: 'Anomalous traffic detected — port 4444',   color: '#fbbf24' },
  { label: 'ALERT', msg: 'Reverse shell attempt blocked',            color: '#ef4444' },
  { label: 'OK',    msg: 'Firewall rule deployed successfully',       color: '#34d399' },
  { label: 'INFO',  msg: 'Threat signature updated — CVE-2024-9999', color: '#60a5fa' },
  { label: 'OK',    msg: 'System integrity verified ✓',              color: '#34d399' },
]

function useRoleCycle() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ROLES.length), 3000)
    return () => clearInterval(t)
  }, [])
  return ROLES[idx]
}

function useLineReveal(count: number, inView: boolean, delay = 600) {
  const [visible, setVisible] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!inView) return
    let i = 0
    const tick = () => {
      i++
      setVisible(i)
      if (i < count) timerRef.current = setTimeout(tick, delay)
    }
    timerRef.current = setTimeout(tick, 400)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [inView, count, delay])

  return visible
}

// ── Code card ─────────────────────────────────────────────────────────────────
function CodeCard({ inView }: { inView: boolean }) {
  const visible = useLineReveal(CODE_LINES.length, inView, 180)
  return (
    <div
      className="rounded-xl overflow-hidden text-xs font-mono"
      style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#161b22' }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#27c93f' }} />
        <span className="ml-3 text-xs opacity-40" style={{ color: '#94a3b8' }}>secure-server.ts</span>
        <span className="ml-auto flex items-center gap-1 text-xs" style={{ color: '#34d399', opacity: 0.7 }}>
          <Code2 size={11} /> TypeScript
        </span>
      </div>
      {/* lines */}
      <div className="px-4 py-3 space-y-0.5" style={{ lineHeight: 1.7 }}>
        {CODE_LINES.map((line, i) => (
          <div
            key={i}
            className="flex"
            style={{
              opacity: i < visible ? 1 : 0,
              transform: i < visible ? 'translateX(0)' : 'translateX(-4px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            <span className="select-none mr-4 text-right" style={{ color: 'rgba(148,163,184,0.25)', minWidth: '1.5ch' }}>{i + 1}</span>
            {line.token && (
              <span style={{ color: line.color, marginRight: '0px' }}>{line.token}</span>
            )}
            <span style={{ color: '#e2e8f0' }}>{line.rest}</span>
          </div>
        ))}
        {/* blinking cursor */}
        {visible >= CODE_LINES.length && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-2 h-3.5 ml-1"
            style={{ background: '#60a5fa', verticalAlign: 'middle' }}
          />
        )}
      </div>
    </div>
  )
}

// ── Terminal card ─────────────────────────────────────────────────────────────
function ThreatCard({ inView }: { inView: boolean }) {
  const visible = useLineReveal(THREAT_LINES.length, inView, 500)
  return (
    <div
      className="rounded-xl overflow-hidden text-xs font-mono"
      style={{ background: '#0a0f0d', border: '1px solid rgba(52,211,153,0.15)' }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: '1px solid rgba(52,211,153,0.08)', background: '#0d1410' }}
      >
        <Terminal size={12} style={{ color: '#34d399' }} />
        <span style={{ color: '#34d399', opacity: 0.8 }}>threat-monitor</span>
        <span className="ml-auto flex items-center gap-1" style={{ color: '#34d399', opacity: 0.5 }}>
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: '#34d399' }}
          />
          live
        </span>
      </div>
      <div className="px-4 py-3 space-y-1">
        {THREAT_LINES.map((line, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5"
            style={{
              opacity: i < visible ? 1 : 0,
              transform: i < visible ? 'translateX(0)' : 'translateX(-4px)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
            }}
          >
            <span
              className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold leading-none"
              style={{
                background: line.color + '22',
                color: line.color,
                fontSize: '0.6rem',
                letterSpacing: '0.05em',
                minWidth: '2.8rem',
                textAlign: 'center',
              }}
            >
              {line.label}
            </span>
            <span style={{ color: '#94a3b8' }}>{line.msg}</span>
          </div>
        ))}
        {visible >= THREAT_LINES.length && (
          <div className="flex items-center gap-1 mt-1" style={{ color: '#34d399' }}>
            <span>$</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >▋</motion.span>
          </div>
        )}
      </div>
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
    { href: profile?.github   || 'https://github.com/eyobed101',              icon: <GithubIcon size={17} />,   label: 'GitHub'   },
    { href: profile?.linkedin || 'https://linkedin.com/in/eyobed-e-61b39b194',icon: <LinkedinIcon size={17} />, label: 'LinkedIn' },
    { href: `mailto:${profile?.email || 'eyobedeliast@gmail.com'}`,           icon: <Mail size={17} />,         label: 'Email'    },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Static background: dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
        }}
      />

      {/* ── Anchored glow orbs (static, no movement) ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '15%', left: '5%',
          width: '480px', height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)',
          filter: 'blur(48px)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          bottom: '10%', right: '8%',
          width: '380px', height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)',
          filter: 'blur(48px)',
        }}
      />

      <div className="container relative z-10 py-28 pt-36">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text content ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            className="flex flex-col"
          >
            {/* eyebrow */}
            <motion.div variants={item} className="flex items-center gap-3 mb-5">
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
                style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                Available for opportunities
              </span>
            </motion.div>

            {/* name */}
            <motion.h1 variants={item} className="font-extrabold leading-none mb-4"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: 'var(--text)', letterSpacing: '-0.03em' }}>
              {profile?.name || 'Eyobed Elias'}
            </motion.h1>

            {/* cycling role */}
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

            {/* description */}
            <motion.p variants={item}
              className="text-base leading-relaxed mb-7 max-w-lg"
              style={{ color: 'var(--text-muted)' }}
            >
              {profile?.description || "Building secure, scalable systems across multiple platforms. Leading technical innovation at Tripways while contributing to national cybersecurity at INSA."}
            </motion.p>

            {/* dual identity badges */}
            <motion.div variants={item} className="flex flex-wrap gap-2.5 mb-8">
              {[
                { icon: <Code2 size={13} />,  label: 'Full Stack Dev',    color: '#3b82f6' },
                { icon: <Shield size={13} />, label: 'Security Engineer', color: '#10b981' },
                { icon: <Lock size={13} />,   label: 'Threat Hunter',     color: '#f59e0b' },
              ].map(({ icon, label, color }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: color + '12',
                    color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {icon} {label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-3 mb-9">
              <a
                href="#work"
                onClick={e => { e.preventDefault(); document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-primary"
              >
                View My Work <ExternalLink size={15} />
              </a>
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-outline"
              >
                Get In Touch
              </a>
            </motion.div>

            {/* socials */}
            <motion.div variants={item} className="flex items-center gap-3">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
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
              <a
                href="https://endpoint.eyobedelias.net.et/uploads/1777320343874-114031482.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium hover-underline transition-colors duration-150"
                style={{ color: 'var(--text-muted)' }}
              >
                Resume ↗
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right: visual identity ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-4 lg:pl-4"
          >
            {/* avatar + name card */}
            <div
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {/* avatar */}
              <div
                className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden"
                style={{ border: '2px solid var(--primary)', boxShadow: '0 0 20px var(--glow)' }}
              >
                {profile?.aboutImage ? (
                  <img src={profile.aboutImage} alt="Eyobed Elias" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                    <Shield size={28} style={{ color: 'var(--primary)', opacity: 0.5 }} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{profile?.name || 'Eyobed Elias'}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>CTO · Software Dev · Security Researcher</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: '#34d399' }}>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#34d399', display: 'inline-block' }}
                  />
                  Active
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>AAA+</span>
              </div>
            </div>

            {/* code snippet */}
            <CodeCard inView={mounted} />

            {/* terminal */}
            <ThreatCard inView={mounted} />
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-1.5 mt-14"
          aria-hidden="true"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown size={17} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          </motion.div>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>scroll</span>
        </motion.div>
      </div>
    </section>
  )
}
