import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../lib/hooks'
import { parseTags, readingTime } from '../lib/api'
import { Calendar, Tag, Clock, Search, ArrowRight } from 'lucide-react'
import type { Post } from '../types'

interface Props { posts: Post[] }

const FALLBACK_POSTS: Omit<Post, 'id' | 'createdAt'>[] = [
  {
    title: 'Dark Mode Toggle Without Flash',
    description: 'Dark mode without the flash of the default theme using CSS variables and localStorage.',
    date: '2021-04-21',
    draft: false,
    slug: 'dark-mode-toggle',
    tags: JSON.stringify(['Theming', 'Dark Mode', 'CSS']),
    content: 'Dark mode toggle without the flash of default theme. CSS variables for color theming, put data-theme attribute on html, not body, so we can run the JS before the DOM finishes rendering.',
  },
  {
    title: 'Accessible Clickable Cards',
    description: 'Building card layouts where the card itself isn\'t an anchor link but the whole card is clickable.',
    date: '2021-04-21',
    draft: false,
    slug: 'clickable-cards',
    tags: JSON.stringify(['Accessibility', 'CSS']),
    content: 'Card layout where the card itself is not an anchor link, but the whole card is clickable using a :before pseudo element on the main anchor.',
  },
  {
    title: 'Docker Compose Version Discrepancies',
    description: 'Solving docker-compose exec workdir errors caused by API version mismatches.',
    date: '2019-12-13',
    draft: false,
    slug: 'docker-compose-error',
    tags: JSON.stringify(['Docker', 'DevOps']),
    content: 'Encountered a weird error while updating with Skela where I could not run a simple script. The fix was to update the docker-compose.yml version from 3.5 to 3.6.',
  },
  {
    title: 'WordPress CORS Publishing Error',
    description: 'Debugging a mysterious JSON response error when publishing WordPress posts locally.',
    date: '2019-12-03',
    draft: false,
    slug: 'wordpress-publish-error',
    tags: JSON.stringify(['WordPress', 'CORS']),
    content: 'Encountered a weird error where publishing posts in local WordPress admin failed. Turned out to be a CORS error from using HTTPS admin to access an HTTP domain.',
  },
]

const ALL_TAG = 'All'

export default function Blog({ posts }: Props) {
  const { ref, inView } = useInView()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(ALL_TAG)

  const data = posts.filter(p => !p.draft).length > 0
    ? posts.filter(p => !p.draft)
    : FALLBACK_POSTS as Post[]

  const allTags = useMemo(() => {
    const set = new Set<string>()
    data.forEach(p => parseTags(p.tags).forEach(t => set.add(t)))
    return [ALL_TAG, ...Array.from(set)]
  }, [data])

  const filtered = useMemo(() => {
    return data.filter(post => {
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description?.toLowerCase().includes(query.toLowerCase())
      const tags = parseTags(post.tags)
      const matchesTag = activeTag === ALL_TAG || tags.includes(activeTag)
      return matchesQuery && matchesTag
    })
  }, [data, query, activeTag])

  const [featured, ...rest] = filtered

  return (
    <section id="blog" aria-labelledby="blog-heading" className="py-28" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <div className="section-heading">
          <span className="section-number">04.</span>
          <h2 id="blog-heading">Insights &amp; Research</h2>
          <div className="line" />
        </div>

        {/* Search + filter */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search articles…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search blog posts"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
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
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-16 text-sm" style={{ color: 'var(--text-muted)' }}>
            No articles found matching your search.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Featured article */}
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                aria-label={`Featured article: ${featured.title}`}
              >
                <div className="flex flex-col md:flex-row gap-0">
                  {/* Accent bar */}
                  <div
                    className="md:w-1 w-full h-1 md:h-auto flex-shrink-0 rounded-l-2xl"
                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 p-8 md:p-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: 'var(--primary)', color: '#fff' }}
                      >
                        Featured
                      </span>
                      {parseTags(featured.tags).map(t => (
                        <span key={t} className="tech-tag flex items-center gap-1">
                          <Tag size={9} /> {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 transition-colors group-hover:text-blue-400" style={{ color: 'var(--text)' }}>
                      {featured.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-5 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
                      {featured.description || featured.content.slice(0, 180) + '…'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(featured.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {readingTime(featured.content)} min read
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2" style={{ color: 'var(--primary)' }}>
                        Read more <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Rest of articles */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post, i) => (
                <motion.article
                  key={post.id || post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="group flex flex-col rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 30px var(--glow)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                  aria-label={post.title}
                >
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {parseTags(post.tags).slice(0, 2).map(t => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                  <h4 className="font-semibold text-base mb-2 leading-snug transition-colors group-hover:text-blue-400" style={{ color: 'var(--text)' }}>
                    {post.title}
                  </h4>
                  <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--text-muted)' }}>
                    {post.description || post.content.slice(0, 120) + '…'}
                  </p>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={11} />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={11} />
                      {readingTime(post.content)} min
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
