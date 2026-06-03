import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Search, Sun, Moon,
  Calendar, Clock, BookOpen, ArrowUpRight,
  SortAsc, SortDesc, Tag,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { parseTags, readingTime } from '../lib/api'
import LogoMark from '../components/LogoMark'
import { FALLBACK_POSTS } from '../components/Blog'
import type { Post } from '../types'

interface Props { posts: Post[] }

const TAG_COLORS: Record<string, string> = {
  'Theming':       '#8b5cf6',
  'Dark Mode':     '#6366f1',
  'CSS':           '#0891b2',
  'Accessibility': '#059669',
  'Docker':        '#2563eb',
  'DevOps':        '#0284c7',
  'WordPress':     '#2563eb',
  'CORS':          '#dc2626',
  'Security':      '#06b6d4',
  'Architecture':  '#f59e0b',
}
const DEFAULT_COLOR = '#3b82f6'

const POST_GRADIENTS = [
  'linear-gradient(135deg,#0f2044,#1e40af)',
  'linear-gradient(135deg,#022c22,#0891b2)',
  'linear-gradient(135deg,#1e0a3c,#6d28d9)',
  'linear-gradient(135deg,#3b0a0a,#b45309)',
  'linear-gradient(135deg,#0a2540,#0284c7)',
  'linear-gradient(135deg,#012a20,#0d9488)',
]

function toPlain(content: string, max = 130) {
  const plain = content
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, '')
    .replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '')
    .replace(/^#{1,6}\s+/gm, '').replace(/^\s*[-*>]\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ').trim()
  return plain.slice(0, max) + (plain.length > max ? '…' : '')
}

// ── List row card (compact horizontal) ───────────────────────────────────────
function ListCard({ post, index, gradient, onRead }: {
  post: Post
  index: number
  gradient: string
  onRead: () => void
}) {
  const tags = parseTags(post.tags)
  const mins = readingTime(post.content)
  const color = TAG_COLORS[tags[0]] || DEFAULT_COLOR
  const excerpt = post.description || toPlain(post.content)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex gap-0 rounded-xl overflow-hidden cursor-pointer"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
      onClick={onRead}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + '50'
        e.currentTarget.style.boxShadow = `0 6px 24px ${color}14`
        e.currentTarget.style.transform = 'translateX(3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
      role="button"
      tabIndex={0}
      aria-label={`Read: ${post.title}`}
      onKeyDown={e => e.key === 'Enter' && onRead()}
    >
      {/* left accent */}
      <div className="w-1 flex-shrink-0" style={{ background: color }} />

      {/* thumbnail */}
      <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden sm:w-28 sm:h-28">
        {post.cover ? (
          <img src={post.cover} alt="" aria-hidden="true"
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: gradient }}>
            <BookOpen size={22} style={{ color: 'rgba(255,255,255,0.2)' }} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex-1 px-4 py-3.5 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {tags.slice(0, 2).map(t => (
              <span key={t} className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ background: (TAG_COLORS[t] || DEFAULT_COLOR) + '15', color: TAG_COLORS[t] || DEFAULT_COLOR }}>
                {t}
              </span>
            ))}
          </div>
          <h3 className="font-semibold leading-snug mb-1 text-sm line-clamp-2 transition-colors duration-200 group-hover:text-blue-400"
            style={{ color: 'var(--text)' }}>
            {post.title}
          </h3>
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Calendar size={10} />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1"><Clock size={10} /> {mins} min</span>
          </div>
          <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color }} />
        </div>
      </div>
    </motion.article>
  )
}

// ── Grid card ─────────────────────────────────────────────────────────────────
function GridCard({ post, index, gradient, onRead }: {
  post: Post
  index: number
  gradient: string
  onRead: () => void
}) {
  const tags = parseTags(post.tags)
  const mins = readingTime(post.content)
  const color = TAG_COLORS[tags[0]] || DEFAULT_COLOR
  const excerpt = post.description || toPlain(post.content)

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.28, delay: index * 0.05 }}
      className="group flex flex-col rounded-xl overflow-hidden cursor-pointer"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', transition: 'all 0.2s ease' }}
      onClick={onRead}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + '45'
        e.currentTarget.style.boxShadow = `0 8px 28px ${color}16`
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      role="button" tabIndex={0}
      aria-label={`Read: ${post.title}`}
      onKeyDown={e => e.key === 'Enter' && onRead()}
    >
      <div className="relative h-36 overflow-hidden flex-shrink-0">
        {post.cover ? (
          <img src={post.cover} alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradient }}>
            <div className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              aria-hidden="true" />
            <BookOpen size={28} style={{ color: 'rgba(255,255,255,0.18)' }} aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-0 left-0 bottom-0 w-0.5" style={{ background: color }} />
        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono"
          style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}>
          <Clock size={9} /> {mins}m
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map(t => (
            <span key={t} className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ background: (TAG_COLORS[t] || DEFAULT_COLOR) + '15', color: TAG_COLORS[t] || DEFAULT_COLOR }}>
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-blue-400"
          style={{ color: 'var(--text)' }}>{post.title}</h3>
        <p className="text-xs leading-relaxed flex-1 line-clamp-3" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {excerpt}
        </p>
        <div className="flex items-center justify-between pt-2.5" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <Calendar size={9} />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <span className="text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all"
            style={{ color }}>Read <ArrowUpRight size={11} /></span>
        </div>
      </div>
    </motion.article>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AllBlogs({ posts }: Props) {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [sortAsc, setSortAsc] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const data = (posts.filter(p => !p.draft).length > 0
    ? posts.filter(p => !p.draft)
    : FALLBACK_POSTS) as Post[]

  const allTags = useMemo(() => {
    const s = new Set<string>()
    data.forEach(p => parseTags(p.tags).forEach(t => s.add(t)))
    return ['All', ...Array.from(s)]
  }, [data])

  const filtered = useMemo(() => {
    return data
      .filter(post => {
        const q = query.toLowerCase()
        const matchQ = !q || post.title.toLowerCase().includes(q) || post.description?.toLowerCase().includes(q)
        const matchT = activeTag === 'All' || parseTags(post.tags).includes(activeTag)
        return matchQ && matchT
      })
      .sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
        return sortAsc ? -diff : diff
      })
  }, [data, query, activeTag, sortAsc])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ── Top bar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
        style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <a href="/" className="flex items-center gap-2">
          <span className="transition-all duration-200 hover:scale-110">
            <LogoMark size={28} />
          </span>
          <span className="font-bold text-sm hidden sm:block" style={{ color: 'var(--text)' }}>
            Eyobed<span style={{ color: 'var(--primary)' }}>.</span>
          </span>
        </a>
        <button onClick={toggle} aria-label="Toggle theme"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </header>

      <main className="pt-14">
        <div className="container py-14">
          {/* ── Page header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="font-mono text-xs mb-2" style={{ color: 'var(--primary)' }}>writing & research</p>
            <h1 className="font-extrabold mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Insights &amp; Research
            </h1>
            <p className="text-sm max-w-xl" style={{ color: 'var(--text-muted)' }}>
              Thoughts on software development, cybersecurity, tooling, and lessons learned from real production systems.
            </p>
          </motion.div>

          {/* ── Controls bar ── */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
              <input
                type="search" placeholder="Search articles…"
                value={query} onChange={e => setQuery(e.target.value)}
                aria-label="Search articles"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* right controls */}
            <div className="flex items-center gap-2">
              {/* sort */}
              <button
                onClick={() => setSortAsc(v => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                aria-label={sortAsc ? 'Sort newest first' : 'Sort oldest first'}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {sortAsc ? <SortAsc size={13} /> : <SortDesc size={13} />}
                {sortAsc ? 'Oldest' : 'Newest'}
              </button>

              {/* view toggle */}
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {(['grid', 'list'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-pressed={viewMode === mode}
                    className="px-3 py-2 text-xs font-medium transition-colors duration-150"
                    style={{
                      background: viewMode === mode ? 'var(--primary)' : 'var(--surface)',
                      color: viewMode === mode ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {mode === 'grid' ? '⊞' : '☰'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tag filters ── */}
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by tag">
            {allTags.map(tag => {
              const active = activeTag === tag
              const c = TAG_COLORS[tag] || DEFAULT_COLOR
              return (
                <button key={tag} onClick={() => setActiveTag(tag)} aria-pressed={active}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    background: active ? (tag === 'All' ? 'var(--primary)' : c) : 'var(--surface)',
                    color: active ? '#fff' : 'var(--text-muted)',
                    border: `1px solid ${active ? (tag === 'All' ? 'var(--primary)' : c) : 'var(--border)'}`,
                    boxShadow: active ? `0 0 14px ${tag === 'All' ? 'var(--glow)' : c + '35'}` : 'none',
                  }}>
                  {tag !== 'All' && <Tag size={10} />}
                  {tag}
                </button>
              )
            })}
          </div>

          {/* ── Results count ── */}
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {data.length} articles
            {activeTag !== 'All' && <> tagged <span style={{ color: TAG_COLORS[activeTag] || DEFAULT_COLOR }}>{activeTag}</span></>}
            {query && <> matching "<span style={{ color: 'var(--text)' }}>{query}</span>"</>}
          </p>

          {/* ── Results ── */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No articles match your filters.</p>
              <button onClick={() => { setQuery(''); setActiveTag('All') }}
                className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                Clear filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {viewMode === 'grid' ? (
                <motion.div key="grid" layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map((post, i) => (
                    <GridCard
                      key={post.id || post.slug}
                      post={post}
                      index={i}
                      gradient={POST_GRADIENTS[i % POST_GRADIENTS.length]}
                      onRead={() => navigate(`/blog/${post.slug}`)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="list" layout className="flex flex-col gap-3 max-w-3xl">
                  {filtered.map((post, i) => (
                    <ListCard
                      key={post.id || post.slug}
                      post={post}
                      index={i}
                      gradient={POST_GRADIENTS[i % POST_GRADIENTS.length]}
                      onRead={() => navigate(`/blog/${post.slug}`)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  )
}
