import { motion } from 'framer-motion'
import { useInView } from '../lib/hooks'
import { parseTags, readingTime } from '../lib/api'
import { Calendar, Clock, ArrowRight, BookOpen, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Post } from '../types'

interface Props { posts: Post[] }

const POST_GRADIENTS = [
  'linear-gradient(135deg,#0f2044,#1e40af)',
  'linear-gradient(135deg,#022c22,#0891b2)',
  'linear-gradient(135deg,#1e0a3c,#6d28d9)',
  'linear-gradient(135deg,#3b0a0a,#b45309)',
  'linear-gradient(135deg,#0a2540,#0284c7)',
  'linear-gradient(135deg,#012a20,#0d9488)',
]

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

export const FALLBACK_POSTS: Omit<Post, 'id' | 'createdAt'>[] = [
  {
    title: 'Dark Mode Toggle Without Flash',
    description: 'How to implement dark mode using CSS variables and localStorage so the page never flashes the wrong theme on load.',
    date: '2021-04-21', draft: false, slug: 'dark-mode-toggle', cover: undefined,
    tags: JSON.stringify(['Theming', 'Dark Mode', 'CSS']),
    content: `Dark mode toggle without the flash of default theme. Important bits:\n\n- CSS variables for color theming\n- Put \`data-theme\` attribute on \`<html>\`, not \`<body>\`, so we can run the JS before the DOM finishes rendering\n- Run local storage check in the \`<head>\`\n- JS for toggle button click handler can come after render\n\n## CSS Variables\n\n\`\`\`css\n:root { --bg: #ffffff; --text: #000000; }\n[data-theme='dark'] { --bg: #000000; --text: #ffffff; }\n\`\`\``,
  },
  {
    title: 'Accessible Clickable Cards',
    description: 'Building card layouts where the entire card is clickable while child links remain independently focusable and accessible.',
    date: '2021-04-21', draft: false, slug: 'clickable-cards', cover: undefined,
    tags: JSON.stringify(['Accessibility', 'CSS']),
    content: `Card layout where the card itself is not an anchor link, but the whole card is clickable using a \`:before\` pseudo element on the main \`<a>\`. Links inside the card are still independently clickable.`,
  },
  {
    title: 'Docker Compose Version Discrepancies',
    description: 'Solving the "Setting workdir for exec is not supported in API < 1.35" error caused by docker-compose.yml version mismatches.',
    date: '2019-12-13', draft: false, slug: 'docker-compose-error', cover: undefined,
    tags: JSON.stringify(['Docker', 'DevOps']),
    content: `## Problem\n\nWhile updating with Skela, I couldn't run a simple script. The fix was updating the version in docker-compose.yml from 3.5 to 3.6.`,
  },
  {
    title: 'WordPress CORS Publishing Error',
    description: 'Debugging a mysterious JSON response failure when publishing posts in a local WordPress setup using Ups Dock.',
    date: '2019-12-03', draft: false, slug: 'wordpress-publish-error', cover: undefined,
    tags: JSON.stringify(['WordPress', 'CORS']),
    content: `## Problem\n\nWhile working on a WordPress project with Ups Dock, I couldn't update or publish posts. Turned out to be a CORS issue — https admin accessing http backend.`,
  },
]

// ── Strip content to plain text ───────────────────────────────────────────────
function toPlain(content: string, max = 160) {
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

// ── Featured hero card ────────────────────────────────────────────────────────
function FeaturedPost({ post, inView, onRead }: {
  post: Post | Omit<Post, 'id' | 'createdAt'>
  inView: boolean
  onRead: () => void
}) {
  const tags = parseTags(post.tags)
  const mins = readingTime(post.content)
  const primaryColor = TAG_COLORS[tags[0]] || DEFAULT_COLOR
  const excerpt = post.description || toPlain(post.content, 220)

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer mb-5"
      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
      onClick={onRead}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = primaryColor + '50'
        e.currentTarget.style.boxShadow = `0 12px 48px ${primaryColor}18`
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.transition = 'all 0.25s ease'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      role="button"
      tabIndex={0}
      aria-label={`Read featured: ${post.title}`}
      onKeyDown={e => e.key === 'Enter' && onRead()}
    >
      {/* left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(to bottom, ${primaryColor}, ${primaryColor}30)` }}
        aria-hidden="true"
      />

      <div className="flex flex-col md:flex-row gap-0">
        {/* cover / visual */}
        <div
          className="md:w-64 lg:w-80 flex-shrink-0 relative overflow-hidden"
          style={{ minHeight: '200px' }}
        >
          {post.cover ? (
            <img
              src={post.cover}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: POST_GRADIENTS[0] }}
            >
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                aria-hidden="true"
              />
              <BookOpen size={40} style={{ color: 'rgba(255,255,255,0.2)' }} aria-hidden="true" />
            </div>
          )}
        </div>

        {/* content */}
        <div className="flex-1 p-7 pl-10 flex flex-col justify-center gap-3">
          {/* top row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: primaryColor + '18', color: primaryColor }}
            >
              Featured
            </span>
            {tags.slice(0, 2).map(t => (
              <span key={t} className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ background: (TAG_COLORS[t] || DEFAULT_COLOR) + '14', color: TAG_COLORS[t] || DEFAULT_COLOR }}>
                {t}
              </span>
            ))}
          </div>

          <h3
            className="font-bold leading-snug"
            style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)', color: 'var(--text)', letterSpacing: '-0.01em' }}
          >
            {post.title}
          </h3>

          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: '60ch' }}>
            {excerpt}
          </p>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1.5">
                <Calendar size={11} />
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={11} /> {mins} min read
              </span>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold transition-all duration-200 group-hover:gap-2"
              style={{ color: primaryColor }}>
              Read article <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// ── Regular post card ─────────────────────────────────────────────────────────
function PostCard({ post, index, inView, gradient, onRead }: {
  post: Post | Omit<Post, 'id' | 'createdAt'>
  index: number
  inView: boolean
  gradient: string
  onRead: () => void
}) {
  const tags = parseTags(post.tags)
  const mins = readingTime(post.content)
  const primaryColor = TAG_COLORS[tags[0]] || DEFAULT_COLOR
  const excerpt = post.description || toPlain(post.content, 105)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.42, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
      className="group flex flex-col rounded-xl overflow-hidden cursor-pointer"
      style={{ background: 'var(--bg)', border: '1px solid var(--border)', transition: 'all 0.22s ease' }}
      onClick={onRead}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = primaryColor + '45'
        e.currentTarget.style.boxShadow = `0 8px 28px ${primaryColor}16`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      role="button"
      tabIndex={0}
      aria-label={`Read: ${post.title}`}
      onKeyDown={e => e.key === 'Enter' && onRead()}
    >
      {/* cover */}
      <div className="relative h-40 overflow-hidden flex-shrink-0">
        {post.cover ? (
          <img
            src={post.cover} alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradient }}>
            <div className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }}
              aria-hidden="true"
            />
            <BookOpen size={30} style={{ color: 'rgba(255,255,255,0.18)' }} aria-hidden="true" />
          </div>
        )}
        {/* reading time badge */}
        <span
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono"
          style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}
        >
          <Clock size={10} /> {mins} min
        </span>
        {/* bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8"
          style={{ background: 'linear-gradient(to top, var(--bg), transparent)' }}
          aria-hidden="true"
        />
      </div>

      {/* body */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        {/* tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 2).map(t => (
            <span key={t} className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ background: (TAG_COLORS[t] || DEFAULT_COLOR) + '15', color: TAG_COLORS[t] || DEFAULT_COLOR }}>
              {t}
            </span>
          ))}
        </div>

        {/* title */}
        <h3
          className="font-semibold leading-snug transition-colors duration-200"
          style={{ fontSize: '0.9rem', color: 'var(--text)' }}
        >
          {post.title}
        </h3>

        {/* excerpt */}
        <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
          {excerpt}
        </p>

        {/* footer */}
        <div className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid var(--border)' }}>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Calendar size={10} />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
            style={{ color: primaryColor }}>
            Read <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

// ── Home section — top 3 recent + CTA ────────────────────────────────────────
export default function Blog({ posts }: Props) {
  const { ref, inView } = useInView()
  const navigate = useNavigate()

  // Sort by date desc, take top 3 non-draft posts
  const data = (posts.filter(p => !p.draft).length > 0
    ? posts.filter(p => !p.draft)
    : FALLBACK_POSTS) as Post[]

  const recent = [...data]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  const [featured, ...rest] = recent

  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="py-28"
      style={{ background: 'var(--surface)' }}
    >
      <div className="container">
        {/* heading + view all */}
        <div className="flex items-end justify-between mb-10">
          <div className="section-heading mb-0" style={{ marginBottom: 0 }}>
            <span className="section-number">04.</span>
            <h2 id="blog-heading">Insights &amp; Research</h2>
            <div className="line" />
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:gap-2.5 flex-shrink-0 ml-6"
            style={{ color: 'var(--primary)' }}
          >
            View all articles <ArrowRight size={14} />
          </button>
        </div>

        <div ref={ref as React.RefObject<HTMLDivElement>}>
          {recent.length === 0 ? (
            <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
              No articles yet.
            </p>
          ) : (
            <>
              {/* featured hero — most recent */}
              {featured && (
                <FeaturedPost
                  post={featured}
                  inView={inView}
                  onRead={() => navigate(`/blog/${featured.slug}`)}
                />
              )}
              {/* next 2 cards */}
              {rest.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-5">
                  {rest.map((post, i) => (
                    <PostCard
                      key={post.slug}
                      post={post}
                      index={i}
                      inView={inView}
                      gradient={POST_GRADIENTS[(i + 1) % POST_GRADIENTS.length]}
                      onRead={() => navigate(`/blog/${post.slug}`)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* mobile CTA */}
          <div className="flex justify-center mt-10 sm:hidden">
            <button
              onClick={() => navigate('/blog')}
              className="btn-outline inline-flex items-center gap-2"
            >
              View all articles <ArrowRight size={14} />
            </button>
          </div>

          {/* desktop subtle CTA below grid */}
          {data.length > 3 && (
            <div className="hidden sm:flex justify-center mt-10">
              <button
                onClick={() => navigate('/blog')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--glow)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                View all {data.length} articles <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
