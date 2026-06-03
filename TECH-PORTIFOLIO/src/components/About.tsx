import { useState } from 'react'
import { motion } from 'framer-motion'
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

const CAT_ACCENT: Record<string, string> = {
  Languages: '#f59e0b',
  Frontend:  '#3b82f6',
  Backend:   '#10b981',
  Databases: '#8b5cf6',
  DevOps:    '#06b6d4',
  Security:  '#ef4444',
}

function Tag({ label, color, delay }: { label: string; color: string; delay: number }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium cursor-default select-none"
      style={{
        background:  hov ? color + '15' : 'var(--surface-2)',
        color:       hov ? color        : 'var(--text-muted)',
        border:      `1px solid ${hov ? color + '45' : 'var(--border)'}`,
        transform:   hov ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow:   hov ? `0 4px 14px ${color}20` : 'none',
        transition:  'all .15s ease',
      }}
    >
      {label}
    </motion.span>
  )
}

function SkillsGrid({ skills, inView }: { skills: SkillCategory[]; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: 'var(--primary)' }}>stack</span>
          <span className="w-px h-3" style={{ background: 'var(--border)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Technologies I Work With</h3>
        </div>
        <span
          className="text-xs font-mono px-2.5 py-1 rounded-full"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          {skills.reduce((s, c) => s + c.items.length, 0)} tools
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: 'var(--border)' }}>
        {skills.map((cat, ci) => {
          const color = CAT_ACCENT[cat.category] ?? '#3b82f6'
          return (
            <div
              key={cat.category}
              className="p-5 flex flex-col gap-3"
              style={{ borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color, letterSpacing: '0.08em' }}
                >
                  {cat.category}
                </span>
                <span
                  className="ml-auto text-xs font-mono"
                  style={{ color: 'var(--text-muted)', opacity: 0.5 }}
                >
                  {cat.items.length}
                </span>
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${Math.min(100, (cat.items.length / 8) * 100)}%` } : {}}
                transition={{ duration: 0.6, delay: 0.3 + ci * 0.07, ease: 'easeOut' }}
                className="h-px rounded-full"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
              />

              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item, ii) => (
                  <Tag
                    key={item}
                    label={item}
                    color={color}
                    delay={inView ? 0.35 + ci * 0.06 + ii * 0.04 : 0}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function About({ profile }: Props) {
  const { ref, inView } = useInView()
  const apiSkills: SkillCategory[] = parseSkills(profile?.aboutSkills)
  const skills = apiSkills.length > 0 ? apiSkills : FALLBACK_SKILLS

  const fade = {
    hidden:  { opacity: 0, y: 20 },
    visible: (d: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.5, delay: d * 0.1, ease: 'easeOut' as const },
    }),
  }

  return (
    <section id="about" aria-labelledby="about-heading" className="py-28">
      <div className="container">
        <div className="section-heading">
          <span className="section-number">01.</span>
          <h2 id="about-heading">About Me</h2>
          <div className="line" />
        </div>

        <div ref={ref as React.RefObject<HTMLDivElement>} className="space-y-14">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              {/* bio card */}
              <motion.div
                custom={0}
                variants={fade}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="rounded-2xl p-7"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                {/* drop-cap first paragraph */}
                <p
                  className="mb-5"
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    lineHeight: '1.9',
                  }}
                >
                  <span
                    style={{
                      float: 'left',
                      fontSize: '3.6rem',
                      lineHeight: '0.78',
                      fontWeight: 900,
                      marginRight: '0.1em',
                      marginTop: '0.08em',
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    H
                  </span>
                  ello! I&apos;m{' '}
                  <strong style={{ color: 'var(--text)', fontWeight: 700 }}>Eyobed</strong>{' '}
                  — a developer who crafts digital experiences with purpose. My fascination
                  began when I first merged logic and creativity through code. Today I build
                  full-stack applications that balance elegant interfaces with resilient
                  backends, fueled by a love for problem-solving.
                </p>

                {/* divider */}
                <div
                  className="my-5"
                  style={{ height: '1px', background: 'linear-gradient(90deg, var(--primary)30, transparent)' }}
                  aria-hidden="true"
                />

                <p
                  className="mb-5"
                  style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.9' }}
                >
                  I&apos;ve had the privilege of working at a{' '}
                  <strong style={{ color: 'var(--text)' }}>national cybersecurity agency</strong>,
                  a{' '}
                  <strong style={{ color: 'var(--text)' }}>start-up</strong>, a{' '}
                  <strong style={{ color: 'var(--text)' }}>fintech company</strong>, and an{' '}
                  <strong style={{ color: 'var(--text)' }}>AI platform</strong>. My focus is
                  building accessible, secure products at the intersection of software
                  engineering and cybersecurity.
                </p>

                <p
                  style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.9' }}
                >
                  When I&apos;m not writing code, I&apos;m researching emerging threats,
                  contributing to national security infrastructure, and exploring the
                  intersection of technology and reformed theology.
                </p>
              </motion.div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              {[
                { value: '4+',  label: 'Years experience',  sub: 'Since 2020',                   color: '#3b82f6' },
                { value: '15+', label: 'Projects shipped',  sub: 'Across 5 domains',              color: '#10b981' },
                { value: '3',   label: 'Active roles',      sub: 'CTO · Developer · Researcher',  color: '#8b5cf6' },
              ].map(({ value, label, sub, color }, i) => (
                <motion.div
                  key={label}
                  custom={i + 1}
                  variants={fade}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = color + '55'
                    e.currentTarget.style.boxShadow = `0 4px 20px ${color}18`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-2xl font-black flex-shrink-0 w-12" style={{ color, letterSpacing: '-0.03em' }}>
                    {value}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <SkillsGrid skills={skills} inView={inView} />
        </div>
      </div>
    </section>
  )
}
