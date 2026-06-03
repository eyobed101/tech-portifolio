import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../lib/hooks'
import { parseSkills } from '../lib/api'
import type { Profile, SkillCategory } from '../types'

interface Props { profile: Profile | null }

const FALLBACK_SKILLS: SkillCategory[] = [
  { category: 'Languages',  items: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'PHP'] },
  { category: 'Frontend',   items: ['React.js', 'Next.js', 'React Native', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend',    items: ['Node.js', 'Express', 'NestJS', 'Laravel', 'Flask', 'FastAPI'] },
  { category: 'Databases',  items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Prisma ORM'] },
  { category: 'DevOps',     items: ['Docker', 'CI/CD', 'AWS', 'RabbitMQ', 'Nginx'] },
  { category: 'Security',   items: ['HMAC Auth', 'OAuth 2.0', 'JWT', 'Threat Hunting', 'NIDS', 'Antivirus R&D'] },
]

const CAT_ACCENT: Record<string, { color: string; glow: string; bg: string; icon: string }> = {
  Languages:  { color: '#f59e0b', glow: 'rgba(245,158,11,0.18)',  bg: 'rgba(245,158,11,0.08)',  icon: '{ }' },
  Frontend:   { color: '#3b82f6', glow: 'rgba(59,130,246,0.18)',  bg: 'rgba(59,130,246,0.08)',  icon: '⬡'   },
  Backend:    { color: '#10b981', glow: 'rgba(16,185,129,0.18)',  bg: 'rgba(16,185,129,0.08)',  icon: '⚙'   },
  Databases:  { color: '#8b5cf6', glow: 'rgba(139,92,246,0.18)',  bg: 'rgba(139,92,246,0.08)',  icon: '◈'   },
  DevOps:     { color: '#06b6d4', glow: 'rgba(6,182,212,0.18)',   bg: 'rgba(6,182,212,0.08)',   icon: '▲'   },
  Security:   { color: '#ef4444', glow: 'rgba(239,68,68,0.18)',   bg: 'rgba(239,68,68,0.08)',   icon: '⬡'   },
}
const DEFAULT_ACCENT = { color: '#3b82f6', glow: 'rgba(59,130,246,0.18)', bg: 'rgba(59,130,246,0.08)', icon: '·' }

// ── Animated tech pill ────────────────────────────────────────────────────────
function TechPill({ label, accent, delay }: {
  label: string
  accent: { color: string; glow: string; bg: string }
  delay: number
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.span
      initial={{ opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.92 }}
      transition={{ duration: 0.22, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium cursor-default select-none"
      style={{
        background:  hovered ? accent.bg   : 'var(--surface-2)',
        color:       hovered ? accent.color : 'var(--text-muted)',
        border:      `1px solid ${hovered ? accent.color + '55' : 'var(--border)'}`,
        boxShadow:   hovered ? `0 0 18px ${accent.glow}` : 'none',
        transform:   hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition:  'all 0.18s ease',
        fontFamily:  'var(--font-sans)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: hovered ? accent.color : 'var(--text-muted)', opacity: hovered ? 1 : 0.4, transition: 'all 0.18s ease' }}
      />
      {label}
    </motion.span>
  )
}

// ── Full-width skills block ───────────────────────────────────────────────────
function SkillsVisualizer({ skills, inView }: { skills: SkillCategory[]; inView: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = skills[activeIdx]
  const accent = CAT_ACCENT[active.category] || DEFAULT_ACCENT

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* ── Header row ── */}
      <div
        className="flex items-center justify-between px-7 pt-6 pb-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <p className="text-xs font-mono mb-0.5" style={{ color: 'var(--primary)' }}>stack</p>
          <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>Technologies I Work With</h3>
        </div>
        <span
          className="text-xs font-mono px-2.5 py-1 rounded-full"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          {skills.reduce((s, c) => s + c.items.length, 0)} tools
        </span>
      </div>

      {/* ── Category selector — wrapping pill grid ── */}
      <div className="px-7 pt-5 pb-0">
        <div
          className="flex flex-wrap gap-2.5"
          role="tablist"
          aria-label="Technology categories"
        >
          {skills.map((cat, i) => {
            const ca = CAT_ACCENT[cat.category] || DEFAULT_ACCENT
            const isActive = i === activeIdx
            return (
              <button
                key={cat.category}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIdx(i)}
                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background:   isActive ? ca.bg   : 'var(--surface-2)',
                  color:        isActive ? ca.color : 'var(--text-muted)',
                  border:       `1px solid ${isActive ? ca.color + '55' : 'var(--border)'}`,
                  boxShadow:    isActive ? `0 0 20px ${ca.glow}` : 'none',
                  transform:    isActive ? 'translateY(-1px)' : 'none',
                }}
              >
                {/* colored dot */}
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: ca.color, opacity: isActive ? 1 : 0.4 }}
                />
                {cat.category}
                {/* count badge */}
                <span
                  className="ml-0.5 px-1.5 py-0.5 rounded-full font-mono leading-none"
                  style={{
                    fontSize: '0.65rem',
                    background: isActive ? ca.color + '25' : 'var(--border)',
                    color:      isActive ? ca.color : 'var(--text-muted)',
                  }}
                >
                  {cat.items.length}
                </span>

                {/* active bottom indicator */}
                {isActive && (
                  <motion.span
                    layoutId="cat-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: ca.color }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Active panel ── */}
      <div className="px-7 pt-5 pb-6">
        {/* progress bar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <motion.div
              key={active.category}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (active.items.length / 8) * 100)}%` }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accent.color}, ${accent.color}60)` }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={active.category}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-semibold font-mono flex-shrink-0"
              style={{ color: accent.color }}
            >
              {active.category}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* pills */}
        <AnimatePresence mode="wait">
          <motion.div key={active.category} className="flex flex-wrap gap-2">
            {active.items.map((item, i) => (
              <TechPill key={item} label={item} accent={accent} delay={i * 0.04} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function About({ profile }: Props) {
  const { ref, inView } = useInView()
  const apiSkills: SkillCategory[] = parseSkills(profile?.aboutSkills)
  const skills = apiSkills.length > 0 ? apiSkills : FALLBACK_SKILLS

  const item = {
    hidden:   { y: 24, opacity: 0 },
    visible:  { y: 0, opacity: 1, transition: { duration: 0.55, ease: 'easeOut' as const } },
  }

  return (
    <section id="about" aria-labelledby="about-heading" className="py-28">
      <div className="container">
        <div className="section-heading">
          <span className="section-number">01.</span>
          <h2 id="about-heading">About Me</h2>
          <div className="line" />
        </div>

        <div ref={ref as React.RefObject<HTMLDivElement>}>
          {/* ── Row 1: bio + stats (full width) ── */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="grid lg:grid-cols-2 gap-12 mb-14"
          >
            {/* bio */}
            <div className="space-y-5">
              <motion.p variants={item} className="text-base leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
                Hello! I'm{' '}
                <strong style={{ color: 'var(--text)' }}>Eyobed</strong>{' '}
                — a developer who crafts digital experiences with purpose. My fascination began when I first merged logic and creativity through code. Today, I build full-stack applications that balance elegant interfaces with resilient backends, fueled by a love for problem-solving and a drive to make technology meaningful.
              </motion.p>
              <motion.p variants={item} className="text-base leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
                Fast-forward to today, and I've had the privilege of working at a{' '}
                <strong style={{ color: 'var(--text)' }}>national cybersecurity agency</strong>, a{' '}
                <strong style={{ color: 'var(--text)' }}>start-up</strong>, a{' '}
                <strong style={{ color: 'var(--text)' }}>fintech company</strong>, and an{' '}
                <strong style={{ color: 'var(--text)' }}>AI platform</strong>. My main focus is building accessible, secure products at the intersection of software engineering and cybersecurity.
              </motion.p>
              <motion.p variants={item} className="text-base leading-[1.85]" style={{ color: 'var(--text-muted)' }}>
                When I'm not writing code, I'm researching emerging threats, contributing to national security infrastructure, and exploring the intersection of technology and reformed theology.
              </motion.p>
            </div>

            {/* stats */}
            <motion.div variants={item} className="flex flex-col justify-center gap-5">
              {[
                { value: '4+',  label: 'Years of professional experience',   sub: 'Since 2020' },
                { value: '15+', label: 'Projects shipped to production',     sub: 'Across 5 domains' },
                { value: '3',   label: 'Active professional roles',          sub: 'CTO · Developer · Researcher' },
              ].map(({ value, label, sub }) => (
                <div
                  key={label}
                  className="flex items-center gap-5 p-5 rounded-xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="text-3xl font-black flex-shrink-0 w-16 text-center gradient-text"
                    style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.03em' }}
                  >
                    {value}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Row 2: full-width skills visualizer ── */}
          <SkillsVisualizer skills={skills} inView={inView} />
        </div>
      </div>
    </section>
  )
}
