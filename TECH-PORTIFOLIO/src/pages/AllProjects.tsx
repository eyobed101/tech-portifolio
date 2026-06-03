import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowLeft, Search, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { parseTech } from '../lib/api'
import LogoMark from '../components/LogoMark'
import { ProjectCard, FALLBACK_PROJECTS, PROJECT_TAGS, CAT_COLOR, CATEGORIES } from '../components/Work'
import type { Project } from '../types'
import type { CatKey } from '../components/Work'

interface Props { projects: Project[] }

export default function AllProjects({ projects }: Props) {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, amount: 0.05 })

  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<CatKey>('All')

  const projectData = (projects.filter(p => p.showInProjects).length > 0
    ? projects.filter(p => p.showInProjects)
    : FALLBACK_PROJECTS) as Project[]

  const filtered = projectData.filter(p => {
    const matchQ = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.content?.toLowerCase().includes(query.toLowerCase())
    const matchCat = activeFilter === 'All' || (PROJECT_TAGS[p.title] || ['Development']).includes(activeFilter)
    return matchQ && matchCat
  })

  // Stats per category
  const catCounts = CATEGORIES.map(({ key }) => ({
    key,
    count: key === 'All'
      ? projectData.length
      : projectData.filter(p => (PROJECT_TAGS[p.title] || ['Development']).includes(key as CatKey)).length,
  }))

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Top bar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
        style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          aria-label="Go back"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <a href="/" className="flex items-center gap-2" aria-label="Home">
          <span className="transition-all duration-200 hover:scale-110">
            <LogoMark size={28} />
          </span>
          <span className="font-bold text-sm hidden sm:block" style={{ color: 'var(--text)' }}>
            Eyobed<span style={{ color: 'var(--primary)' }}>.</span>
          </span>
        </a>

        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </header>

      <main className="pt-14">
        <div className="container py-16">

          {/* ── Page title ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-12"
          >
            <p className="font-mono text-sm mb-2" style={{ color: 'var(--primary)' }}>
              all the things I've built
            </p>
            <h1
              className="font-extrabold mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              All Projects
            </h1>
            <p className="text-sm max-w-xl" style={{ color: 'var(--text-muted)' }}>
              A full archive of personal projects, open-source work, and professional builds spanning full-stack development, cybersecurity, and research.
            </p>
          </motion.div>

          {/* ── Controls ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search projects…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search projects"
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            {/* Filter pills with counts */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {catCounts.map(({ key, count }) => {
                const active = activeFilter === key
                const color = CAT_COLOR[key] || 'var(--primary)'
                return (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key as CatKey)}
                    aria-pressed={active}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                    style={{
                      background: active ? (key === 'All' ? 'var(--primary)' : color) : 'var(--surface)',
                      color: active ? '#fff' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: active ? (key === 'All' ? 'var(--primary)' : color) : 'var(--border)',
                      boxShadow: active ? `0 0 14px ${key === 'All' ? 'var(--glow)' : color + '40'}` : 'none',
                    }}
                  >
                    {key}
                    <span
                      className="px-1.5 py-0.5 rounded-full text-xs font-mono leading-none"
                      style={{
                        background: active ? 'rgba(255,255,255,0.2)' : 'var(--surface-2)',
                        color: active ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* ── Results count ── */}
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {projectData.length} projects
            {activeFilter !== 'All' && <> in <span style={{ color: CAT_COLOR[activeFilter] || 'var(--primary)' }}>{activeFilter}</span></>}
            {query && <> matching "<span style={{ color: 'var(--text)' }}>{query}</span>"</>}
          </p>

          {/* ── Grid ── */}
          <div ref={gridRef}>
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No projects match your filters.</p>
                <button
                  onClick={() => { setQuery(''); setActiveFilter('All') }}
                  className="mt-4 text-sm font-medium"
                  style={{ color: 'var(--primary)' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((proj, i) => (
                    <motion.div
                      key={proj.title}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.22, delay: i * 0.04 }}
                    >
                      <ProjectCard proj={proj} index={i} inView={inView} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* ── Tech distribution sidebar-style stats ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 pt-12"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p className="text-xs font-mono mb-6" style={{ color: 'var(--text-muted)' }}>tech used across all projects</p>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const techCount: Record<string, number> = {}
                projectData.forEach(p => {
                  parseTech(p.tech).forEach(t => { techCount[t] = (techCount[t] || 0) + 1 })
                })
                return Object.entries(techCount)
                  .sort((a, b) => b[1] - a[1])
                  .map(([tech, count]) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {tech}
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.6rem' }}
                      >
                        {count}
                      </span>
                    </span>
                  ))
              })()}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
