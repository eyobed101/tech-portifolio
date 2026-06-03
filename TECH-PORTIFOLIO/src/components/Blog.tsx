import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../lib/hooks'
import { parseTags, readingTime } from '../lib/api'
import { Calendar, Clock, Search, ArrowRight, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Post } from '../types'

interface Props { posts: Post[] }

// Gradient covers for posts without images
const POST_GRADIENTS = [
  'linear-gradient(135deg,#1e3a5f,#1e40af)',
  'linear-gradient(135deg,#064e3b,#0891b2)',
  'linear-gradient(135deg,#3b0764,#6d28d9)',
  'linear-gradient(135deg,#7c2d12,#ea580c)',
  'linear-gradient(135deg,#0c4a6e,#0284c7)',
  'linear-gradient(135deg,#134e4a,#0d9488)',
]

// Tag accent colours
const TAG_COLORS: Record<string, string> = {
  'Theming':      '#8b5cf6',
  'Dark Mode':    '#6366f1',
  'CSS':          '#0891b2',
  'Accessibility':'#059669',
  'Docker':       '#2563eb',
  'DevOps':       '#0284c7',
  'WordPress':    '#2563eb',
  'CORS':         '#dc2626',
  'Security':     '#06b6d4',
  'Architecture': '#f59e0b',
}

const DEFAULT_TAG_COLOR = '#3b82f6'

export const FALLBACK_POSTS: Omit<Post, 'id' | 'createdAt'>[] = [
  {
    title: 'Dark Mode Toggle Without Flash',
    description: 'How to implement dark mode using CSS variables and localStorage so the page never flashes the wrong theme on load.',
    date: '2021-04-21',
    draft: false,
    slug: 'dark-mode-toggle',
    cover: undefined,
    tags: JSON.stringify(['Theming', 'Dark Mode', 'CSS']),
    content: `Dark mode toggle without the flash of default theme. Important bits:\n\n- CSS variables for color theming\n- Put \`data-theme\` attribute on \`<html>\`, not \`<body>\`, so we can run the JS before the DOM finishes rendering\n- Run local storage check in the \`<head>\`\n- JS for toggle button click handler can come after render\n\n## CSS Variables\n\n\`\`\`css\n:root {\n  --bg: #ffffff;\n  --text: #000000;\n}\n\n[data-theme='dark'] {\n  --bg: #000000;\n  --text: #ffffff;\n}\n\`\`\`\n\n## JavaScript\n\n\`\`\`js\nconst themeToggleBtn = document.querySelector('.js-theme-toggle');\n\nthemeToggleBtn.addEventListener('click', () => onToggleClick());\n\nconst onToggleClick = () => {\n  const { theme } = document.documentElement.dataset;\n  const themeTo = theme === 'light' ? 'dark' : 'light';\n  document.documentElement.setAttribute('data-theme', themeTo);\n  localStorage.setItem('theme', themeTo);\n};\n\`\`\``,
  },
  {
    title: 'Accessible Clickable Cards',
    description: 'Building card layouts where the entire card is clickable while child links remain independently focusable and accessible.',
    date: '2021-04-21',
    draft: false,
    slug: 'clickable-cards',
    cover: undefined,
    tags: JSON.stringify(['Accessibility', 'CSS']),
    content: `Card layout where the card itself is not an anchor link, but the whole card is clickable using a \`:before\` pseudo element on the main \`<a>\`. Links inside the card are still independently clickable.\n\n## CSS\n\n\`\`\`css\n.grid__item {\n  &:hover,\n  &:focus-within {\n    background-color: #eee;\n  }\n\n  a {\n    position: relative;\n    z-index: 1;\n  }\n\n  h2 a::before {\n    content: '';\n    display: block;\n    position: absolute;\n    z-index: 0;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    background-color: transparent;\n    transition: background-color 0.1s ease-out;\n  }\n}\n\`\`\`\n\nThis technique keeps the card interactive as a whole while maintaining proper focus management for all nested interactive elements — critical for keyboard and screen reader users.`,
  },
  {
    title: 'Docker Compose Version Discrepancies',
    description: 'Solving the "Setting workdir for exec is not supported in API < 1.35" error caused by docker-compose.yml version mismatches.',
    date: '2019-12-13',
    draft: false,
    slug: 'docker-compose-error',
    cover: undefined,
    tags: JSON.stringify(['Docker', 'DevOps']),
    content: `## Problem\n\nWhile updating with Skela, I couldn't run a simple script:\n\n\`\`\`shell\n#!/bin/bash\ndocker-compose exec -w /var/www/html/wp-content/themes/skela wordpress composer "$@"\n\`\`\`\n\nRunning \`./bin/composer install\` returned:\n\n\`\`\`\nERROR: Setting workdir for exec is not supported in API < 1.35 (1.30)\n\`\`\`\n\n## Solution\n\nThe fix was updating the version in \`docker-compose.yml\` from \`3.5\` to \`3.6\`:\n\n\`\`\`yaml\nversion: '3.6'\nservices:\n  wordpress:\n    build: .\n\`\`\`\n\nStrange because 3.5 isn't anywhere close to API version 1.35 from the error message — but bumping the compose file version resolved it.`,
  },
  {
    title: 'WordPress CORS Publishing Error',
    description: 'Debugging a mysterious JSON response failure when publishing posts in a local WordPress setup using Ups Dock.',
    date: '2019-12-03',
    draft: false,
    slug: 'wordpress-publish-error',
    cover: undefined,
    tags: JSON.stringify(['WordPress', 'CORS']),
    content: `## Problem\n\nWhile working on a WordPress project with Ups Dock, I couldn't update or publish posts in my local WP admin. The error was:\n\n> Publishing failed. Error message: The response is not a valid JSON response.\n\nOpening the console revealed CORS errors.\n\n## Root Cause\n\nI was on the **https** WP admin (\`https://project.ups.dock/wp-admin\`) but the backend was on **http**. Trying to modify a non-https domain from an https context triggers a CORS block.\n\n## Solution\n\nSwitch to the non-https WP admin URL:\n\n\`\`\`\nhttp://project.ups.dock/wp-admin\n\`\`\`\n\nPosts published without issue. Classic CORS gotcha — always check your protocol mismatch before digging deeper into Gutenberg or plugin issues.`,
  },
]

const ALL_TAG = 'All'

// ── Compact blog card ────────────────────────────────────────────────────────
function BlogCard({
  post,
  index,
  inView,
  gradient,
  onRead,
}: {
  post: Post | Omit<Post, 'id' | 'createdAt'>
  index: number
  inView: boolean
  gradient: string
  onRead: () => void
}) {
  const tags = parseTags(post.tags)
  const mins = readingTime(post.content)
  // Strip HTML tags and markdown to produce clean plain-text preview
  const plainContent = post.content
    .replace(/<style[\s\S]*?<\/style>/gi, '')   // remove style blocks
    .replace(/<script[\s\S]*?<\/script>/gi, '') // remove script blocks
    .replace(/<[^>]+>/g, ' ')                   // strip all HTML tags
    .replace(/&nbsp;/g, ' ')                    // decode common entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, '')                     // strip numeric entities
    .replace(/```[\s\S]*?```/g, '')             // remove fenced code blocks
    .replace(/`[^`]+`/g, '')                    // remove inline code
    .replace(/^#{1,6}\s+/gm, '')               // remove heading markers
    .replace(/^\s*[-*>]\s+/gm, '')             // remove list/blockquote markers
    .replace(/\*\*(.+?)\*\*/g, '$1')           // unwrap bold
    .replace(/\*(.+?)\*/g, '$1')               // unwrap italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // unwrap links
    .replace(/\s+/g, ' ')                       // collapse all whitespace
    .trim()
  const excerpt = post.description || (plainContent.slice(0, 115) + (plainContent.length > 115 ? '…' : ''))
  const primaryTag = tags[0]
  const tagColor = TAG_COLORS[primaryTag] || DEFAULT_TAG_COLOR

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.09, ease: 'easeOut' }}
      className="group flex flex-col rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onClick={onRead}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 8px 32px ${tagColor}20`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      role="button"
      tabIndex={0}
      aria-label={`Read: ${post.title}`}
      onKeyDown={e => e.key === 'Enter' && onRead()}
    >
      {/* Cover image / gradient */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ background: gradient }}
          >
            {/* subtle dot grid overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
              aria-hidden="true"
            />
            {/* centered icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={36} style={{ color: 'rgba(255,255,255,0.2)' }} aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Reading time badge */}
        <span
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono"
          style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)' }}
        >
          <Clock size={10} />
          {mins} min
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 2).map(t => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                background: (TAG_COLORS[t] || DEFAULT_TAG_COLOR) + '18',
                color: TAG_COLORS[t] || DEFAULT_TAG_COLOR,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-[0.9rem] leading-snug mb-2 transition-colors duration-200 group-hover:text-blue-400"
          style={{ color: 'var(--text)' }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          className="text-xs leading-relaxed flex-1 mb-4"
          style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}
        >
          {excerpt}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Calendar size={11} />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span
            className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
            style={{ color: 'var(--primary)' }}
          >
            Read more <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function Blog({ posts }: Props) {
  const { ref, inView } = useInView()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(ALL_TAG)

  const data = (posts.filter(p => !p.draft).length > 0
    ? posts.filter(p => !p.draft)
    : FALLBACK_POSTS) as Post[]

  const allTags = useMemo(() => {
    const set = new Set<string>()
    data.forEach(p => parseTags(p.tags).forEach(t => set.add(t)))
    return [ALL_TAG, ...Array.from(set)]
  }, [data])

  const filtered = useMemo(() =>
    data.filter(post => {
      const q = query.toLowerCase()
      const matchQ = !q || post.title.toLowerCase().includes(q) || post.description?.toLowerCase().includes(q)
      const matchT = activeTag === ALL_TAG || parseTags(post.tags).includes(activeTag)
      return matchQ && matchT
    }),
    [data, query, activeTag]
  )

  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="py-28"
      style={{ background: 'var(--surface)' }}
    >
      <div className="container">
        {/* Heading */}
        <div className="section-heading">
          <span className="section-number">04.</span>
          <h2 id="blog-heading">Insights &amp; Research</h2>
          <div className="line" />
        </div>

        {/* Search + filter */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search articles…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search blog posts"
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                aria-pressed={activeTag === tag}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: activeTag === tag ? 'var(--primary)' : 'var(--bg)',
                  color: activeTag === tag ? '#fff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: activeTag === tag ? 'var(--primary)' : 'var(--border)',
                  boxShadow: activeTag === tag ? '0 0 12px var(--glow)' : 'none',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-16 text-sm" style={{ color: 'var(--text-muted)' }}>
            No articles found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((post, i) => (
              <BlogCard
                key={post.slug + i}
                post={post}
                index={i}
                inView={inView}
                gradient={POST_GRADIENTS[i % POST_GRADIENTS.length]}
                onRead={() => navigate(`/blog/${post.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
