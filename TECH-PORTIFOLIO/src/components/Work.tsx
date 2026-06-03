import { useState, useRef } from 'react'
import { motion, useInView as useFramerInView } from 'framer-motion'
import { parseTech } from '../lib/api'
import { ExternalLink, ArrowUpRight, ArrowRight } from 'lucide-react'
import { GithubIcon } from './SocialIcons'
import { useNavigate } from 'react-router-dom'
import type { FeaturedProject, Project } from '../types'

interface Props {
  featured: FeaturedProject[]
  projects: Project[]
}

const CATEGORIES = [
  { key: 'All',           icon: null },
  { key: 'Full Stack',    icon: null },
  { key: 'Cybersecurity', icon: null },
  { key: 'Development',   icon: null },
  { key: 'Research',      icon: null },
]

type CatKey = 'All' | 'Full Stack' | 'Cybersecurity' | 'Development' | 'Research'

const PROJECT_TAGS: Record<string, CatKey[]> = {
  'AlphaMail':                            ['Full Stack', 'Development'],
  'HikeHub':                              ['Full Stack', 'Development'],
  'Bus Station Management Platform':      ['Full Stack', 'Development'],
  'Keno Betting Platform':               ['Full Stack', 'Development'],
  'HikeHub Telegram Mini-App':           ['Full Stack', 'Development'],
  'Network Intrusion Detection System':  ['Cybersecurity', 'Full Stack'],
  'Real-Time Whiteboard Collaboration Platform': ['Full Stack', 'Development'],
  'Blackpool Sports Betting Platform':   ['Full Stack', 'Development'],
  'Solar Pay-As-You-Go Mobile Platform': ['Development'],
  'NTFS Drive Files Counter for Node.js':['Research', 'Development'],
}

// Accent colors per category
const CAT_COLOR: Record<string, string> = {
  'Full Stack':    '#3b82f6',
  'Cybersecurity': '#06b6d4',
  'Development':   '#8b5cf6',
  'Research':      '#f59e0b',
}

// Gradient backgrounds for image placeholders
const PROJ_GRADIENTS = [
  'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #0f172a 100%)',
  'linear-gradient(135deg, #064e3b 0%, #0891b2 50%, #0f172a 100%)',
  'linear-gradient(135deg, #3b0764 0%, #6d28d9 50%, #1e1b4b 100%)',
  'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #1c1917 100%)',
  'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0f172a 100%)',
  'linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #042f2e 100%)',
]

const FALLBACK_FEATURED: Omit<FeaturedProject, 'id' | 'createdAt'>[] = [
  {
    title: 'AlphaMail',
    cover: undefined,
    github: 'https://github.com/eyobed101',
    external: 'https://alphamail.ai',
    tech: JSON.stringify(['TypeScript', 'Next.js', 'FastAPI', 'Redis', 'LLM', 'Socket.IO']),
    content: 'AI-powered email automation platform with advanced intelligent agent features for categorization, summarization, task extraction, and drafting — built end-to-end.',
  },
  {
    title: 'Network Intrusion Detection System',
    cover: undefined,
    github: 'https://github.com/eyobed101/network-ids',
    external: 'https://network-ids-teal.vercel.app/dashboard',
    tech: JSON.stringify(['Next.js', 'TypeScript', 'shadcn/ui', 'ECharts', 'Node.js', 'Socket.IO', 'MongoDB']),
    content: 'Real-time threat detection platform that visualizes packet data with live dashboards for intrusions, suspicious IPs, protocol activity, and traffic trend analysis.',
  },
  {
    title: 'HikeHub',
    cover: undefined,
    github: 'https://github.com/eyobed101',
    external: 'https://hikehub.tripways.et',
    tech: JSON.stringify(['TypeScript', 'React', 'Node.js', 'WebSockets', 'Socket.IO', 'Redux Toolkit', 'ApexCharts']),
    content: 'Full-stack event booking platform syncing to mobile. Handles real-time bookings, participant tracking, payments, and engagement analytics via Node.js WebSocket architecture.',
  },
]

export const FALLBACK_PROJECTS: Omit<Project, 'id' | 'createdAt'>[] = [
  {
    title: 'Bus Station Management Platform',
    github: 'https://github.com/eyobed101/IETNEW',
    external: 'https://d2btz9afu68bav.cloudfront.net/',
    tech: JSON.stringify(['React', 'Redux', 'Node.js', 'MySQL', 'Redis', 'AWS']),
    showInProjects: true,
    content: 'SaaS platform for bus stations with multi-role access, real-time ticketing, and route logistics.',
  },
  {
    title: 'Keno Betting Platform',
    github: 'https://github.com/eyobed101/keno_frontend-main.git',
    external: 'https://keno-frontend-main.vercel.app/',
    tech: JSON.stringify(['React', 'Vite', 'Redux', 'Node.js', 'MongoDB']),
    showInProjects: true,
    content: 'Web-based Keno platform with live draws, wallet management, and mobile-friendly UI.',
  },
  {
    title: 'HikeHub Telegram Mini-App',
    github: 'https://github.com/eyobed101',
    external: 'https://t.me/hikehubbot/HikeHub',
    tech: JSON.stringify(['TypeScript', 'React', 'Vite', 'Zustand', 'Framer Motion']),
    showInProjects: true,
    content: 'Telegram mini-app for discovering, booking, and managing hiking events within Telegram.',
  },
  {
    title: 'Real-Time Whiteboard',
    github: 'https://github.com/eyobed101/whiteboard-app',
    external: 'https://whiteboard-app-bice.vercel.app',
    tech: JSON.stringify(['TypeScript', 'Next.js', 'Socket.IO']),
    showInProjects: true,
    content: 'Shared canvas for drawing and brainstorming with instant WebSocket-powered updates.',
  },
  {
    title: 'Blackpool Sports Betting',
    github: 'https://github.com/eyobed101/blackpool-frontend.git',
    external: 'https://blackpool-frontend.vercel.app/',
    tech: JSON.stringify(['Laravel', 'WebSockets', 'Redis', 'REST API']),
    showInProjects: true,
    content: 'Real-time sports betting platform with live odds broadcasting via WebSockets.',
  },
  {
    title: 'NTFS Drive Files Counter',
    github: 'https://github.com/eyobed101/DriveFileCounter.git',
    external: 'https://www.npmjs.com/package/drive-file-counter',
    tech: JSON.stringify(['Node.js', 'NTFS', 'Python', 'Windows']),
    showInProjects: true,
    content: 'Node.js utility for estimating file counts on NTFS drives, returns results as JSON via standalone executable.',
  },
]

export { PROJECT_TAGS, CAT_COLOR, CATEGORIES, FALLBACK_FEATURED }
export type { CatKey }

// ── Featured Card — vertical layout ─────────────────────────────────────────
function FeaturedCard({
  proj,
  index,
  inView,
}: {
  proj: FeaturedProject | Omit<FeaturedProject, 'id' | 'createdAt'>
  index: number
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const tech = parseTech(proj.tech)
  const gradient = PROJ_GRADIENTS[index % PROJ_GRADIENTS.length]
  const tints = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
  const tint = tints[index % tints.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? tint + '50' : 'var(--border)'}`,
        boxShadow: hovered ? `0 20px 56px ${tint}20` : 'none',
        transition: 'box-shadow 0.35s ease, border-color 0.25s ease',
      }}
      aria-label={`Featured project: ${proj.title}`}
    >
      {/* ── Image / visual area ── */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ height: '200px', background: gradient }}
      >
        {/* subtle patterns behind image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        {proj.cover ? (
          <img
            src={proj.cover}
            alt={proj.title}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
              padding: '12px',
              transition: 'transform 0.45s ease',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
            }}
          />
        ) : (
          /* no cover — show gradient with glow blob */
          <div
            className="absolute"
            style={{
              top: '5%', left: '10%', width: '80%', height: '90%',
              background: `radial-gradient(circle, ${tint}35 0%, transparent 70%)`,
              filter: 'blur(30px)',
            }}
            aria-hidden="true"
          />
        )}

    

      
      </div>

      {/* ── Content block ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* title */}
        <h3
          className="font-bold leading-snug"
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'var(--text)',
            letterSpacing: '-0.01em',
          }}
        >
          {proj.title}
        </h3>

        {/* description — always visible */}
        <p
          className="text-xs leading-relaxed flex-1"
          style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}
        >
          {proj.content}
        </p>

        {/* tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {tech.map(t => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-lg text-xs font-mono"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* links */}
        <div
          className="flex items-center gap-2 pt-2"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {proj.external && (
            <a
              href={proj.external}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${proj.title} live demo`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: tint, color: '#fff' }}
            >
              <ExternalLink size={12} /> Live Demo
            </a>
          )}
          {proj.github && (
            <a
              href={proj.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${proj.title} source`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = tint; e.currentTarget.style.color = tint }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <GithubIcon size={12} /> Source
            </a>
          )}
          <a
            href={proj.external || proj.github || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium transition-all duration-200"
            style={{ color: tint, opacity: hovered ? 1 : 0.6, transition: 'opacity 0.2s' }}
          >
            View <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </motion.article>
  )
}

// ── Other project card ───────────────────────────────────────────────────────
export function ProjectCard({ proj, index, inView }: { proj: Project | Omit<Project, 'id' | 'createdAt'>; index: number; inView: boolean }) {
  const tech = parseTech(proj.tech)
  const tags = PROJECT_TAGS[proj.title] || ['Development']
  const accentColor = CAT_COLOR[tags[0]] || '#3b82f6'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accentColor + '60'
        e.currentTarget.style.boxShadow = `0 8px 32px ${accentColor}18`
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Accent top border */}
      <div
        className="h-0.5 w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        aria-hidden="true"
      />

      <div className="flex flex-col flex-1 p-6">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          {/* Category dot */}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: accentColor + '15', color: accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentColor }} />
            {tags[0]}
          </span>

          {/* Action icons */}
          <div className="flex gap-2">
            {proj.github && (
              <a
                href={proj.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${proj.title} source`}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = accentColor; e.currentTarget.style.background = accentColor + '15' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
              >
                <GithubIcon size={15} />
              </a>
            )}
            {proj.external && (
              <a
                href={proj.external}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${proj.title} demo`}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = accentColor; e.currentTarget.style.background = accentColor + '15' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <h4
          className="font-semibold text-[0.95rem] mb-2 leading-snug transition-colors duration-200"
          style={{ color: 'var(--text)' }}
        >
          {proj.title}
        </h4>

        {/* Description */}
        <p className="text-xs leading-relaxed flex-1 mb-5" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {proj.content}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {tech.slice(0, 3).map(t => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-xs font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {t}
            </span>
          ))}
          {tech.length > 3 && (
            <span
              className="px-2 py-0.5 rounded text-xs font-mono"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              +{tech.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function Work({ featured, projects }: Props) {
  const navigate = useNavigate()
  const featuredRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)

  const featuredInView = useFramerInView(featuredRef, { once: true, amount: 0.1 })
  const highlightInView = useFramerInView(highlightRef, { once: true, amount: 0.1 })

  const featuredData = featured.length > 0 ? featured : FALLBACK_FEATURED as FeaturedProject[]
  const projectData = (projects.filter(p => p.showInProjects).length > 0
    ? projects.filter(p => p.showInProjects)
    : FALLBACK_PROJECTS) as Project[]

  // Only show first 3 on home page
  const highlighted = projectData.slice(0, 3)

  return (
    <section id="work" aria-labelledby="work-heading" className="py-28">
      <div className="container">

        {/* ── Section heading ── */}
        <div className="section-heading">
          <span className="section-number">03.</span>
          <h2 id="work-heading">Featured Work</h2>
          <div className="line" />
        </div>

        {/* ── Featured cards — 3-col cinematic grid ── */}
        <div ref={featuredRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {featuredData.map((proj, i) => (
            <FeaturedCard key={'id' in proj ? proj.id : i} proj={proj} index={i} inView={featuredInView} />
          ))}
        </div>

        {/* ── Highlighted other projects (3 max) ── */}
        <div ref={highlightRef}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-mono mb-1" style={{ color: 'var(--primary)' }}>more things I've built</p>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Other Noteworthy Projects</h3>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {highlighted.map((proj, i) => (
              <motion.div
                key={proj.title}
                initial={{ opacity: 0, y: 20 }}
                animate={highlightInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
              >
                <ProjectCard proj={proj} index={i} inView={highlightInView} />
              </motion.div>
            ))}
          </div>

          {/* View all CTA */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.color = 'var(--primary)'
                e.currentTarget.style.boxShadow = '0 4px 20px var(--glow)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              View All Projects
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
