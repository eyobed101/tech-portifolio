import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag, BookOpen } from 'lucide-react'
import { fetchPost, parseTags, readingTime } from '../lib/api'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import LogoMark from '../components/LogoMark'
import { FALLBACK_POSTS } from '../components/Blog'
import type { Post } from '../types'

// Very lightweight markdown renderer — handles headings, code blocks, inline code, bold, lists
function renderMarkdown(md: string): string {
  return md
    // Fenced code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="code-block" data-lang="${lang || ''}" role="region" aria-label="Code block"><code>${escHtml(code.trim())}</code></pre>`
    )
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // H2
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Unordered list items
    .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
    // Double newline → paragraph break
    .replace(/\n{2,}/g, '</p><p class="md-p">')
    // Wrap in opening paragraph
    .replace(/^/, '<p class="md-p">')
    .replace(/$/, '</p>')
    // Clean up empty paragraphs around block elements
    .replace(/<p class="md-p">(<(?:h2|h3|pre|blockquote|li))/g, '$1')
    .replace(/(<\/(?:h2|h3|pre|blockquote|li)>)<\/p>/g, '$1')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li class="md-li">[\s\S]*?<\/li>)/g, '<ul class="md-ul">$1</ul>')
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const POST_GRADIENTS = [
  'linear-gradient(135deg,#1e3a5f,#1e40af)',
  'linear-gradient(135deg,#064e3b,#0891b2)',
  'linear-gradient(135deg,#3b0764,#6d28d9)',
  'linear-gradient(135deg,#7c2d12,#ea580c)',
  'linear-gradient(135deg,#0c4a6e,#0284c7)',
  'linear-gradient(135deg,#134e4a,#0d9488)',
]

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    if (!slug) { setLoading(false); return }

    fetchPost(slug)
      .then(setPost)
      .catch(() => {
        // Fall back to static data
        const fallback = FALLBACK_POSTS.find(p => p.slug === slug)
        if (fallback) {
          setPost({ ...fallback, id: fallback.slug, createdAt: fallback.date } as Post)
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  const tags = post ? parseTags(post.tags) : []
  const mins = post ? readingTime(post.content) : 0
  const gradientIndex = FALLBACK_POSTS.findIndex(p => p.slug === slug)
  const gradient = POST_GRADIENTS[Math.max(0, gradientIndex) % POST_GRADIENTS.length]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Minimal top bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
        style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:-translate-x-0.5"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Back to portfolio"
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2"
          aria-label="Home"
        >
          <span className="transition-all duration-200 hover:scale-110">
            <LogoMark size={28} />
          </span>
          <span className="font-bold text-sm hidden sm:block" style={{ color: 'var(--text)' }}>
            Eyobed<span style={{ color: 'var(--primary)' }}>.</span>
          </span>
        </a>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={theme}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </header>

      <main className="pt-14">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--primary)' }}
              role="status"
              aria-label="Loading"
            />
          </div>
        ) : !post ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Post not found.</p>
            <button onClick={() => navigate(-1)} className="btn-outline text-sm py-2">Go back</button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Hero cover */}
            <div className="relative w-full overflow-hidden" style={{ height: 'clamp(200px, 35vh, 360px)' }}>
              {post.cover ? (
                <img
                  src={post.cover}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0" style={{ background: gradient }}>
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '28px 28px',
                    }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen size={56} style={{ color: 'rgba(255,255,255,0.15)' }} aria-hidden="true" />
                  </div>
                </div>
              )}
              {/* Bottom fade */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: `linear-gradient(to bottom, transparent, var(--bg))` }}
                aria-hidden="true"
              />
            </div>

            {/* Article content */}
            <div className="container">
              <div className="max-w-2xl mx-auto -mt-6 relative z-10 pb-24">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  {tags.map(t => (
                    <span
                      key={t}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'var(--surface-2)', color: 'var(--primary)', border: '1px solid var(--border)' }}
                    >
                      <Tag size={9} /> {t}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1
                  className="font-extrabold leading-tight mb-5"
                  style={{
                    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                    color: 'var(--text)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {post.title}
                </h1>

                {/* Date + read time */}
                <div
                  className="flex items-center gap-5 text-xs mb-8 pb-8"
                  style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {mins} min read
                  </span>
                </div>

                {/* Rendered content */}
                <div
                  className="post-body"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                />

                {/* Back CTA */}
                <div className="mt-16 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
                  <button
                    onClick={() => navigate(-1)}
                    className="btn-outline inline-flex items-center gap-2 text-sm"
                  >
                    <ArrowLeft size={15} /> Back to all posts
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
