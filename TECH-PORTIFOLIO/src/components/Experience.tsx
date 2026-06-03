import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../lib/hooks'
import { parseContent } from '../lib/api'
import { MapPin, Calendar, ExternalLink, ChevronRight } from 'lucide-react'
import type { Job } from '../types'

interface Props { jobs: Job[] }

// Fallback data if API not available
const FALLBACK_JOBS: Omit<Job, 'id' | 'createdAt'>[] = [
  {
    title: 'Chief Technology Officer (Part-time)',
    company: 'Trip Ways PLC',
    location: 'Addis Ababa, Ethiopia',
    range: 'January 2024 – Present',
    url: 'https://tripways.com.et/',
    content: JSON.stringify([
      'Spearheaded full-stack development of a Bus Ticketing System from requirements through deployment, serving 2+ major stations',
      'Implemented role-based access control and station-specific modules, reducing administrative workload by 35%',
      'Engineered the Station Management Module, decreasing ticket processing time by 40%',
      'Architected cloud infrastructure ensuring high availability and scalability during peak travel periods',
      'Led a cross-functional development team while establishing coding standards and CI/CD pipelines',
    ]),
  },
  {
    title: 'Senior Application Software Developer',
    company: 'INSA',
    location: 'Addis Ababa, Ethiopia',
    range: '2022 – Present',
    url: 'https://insa.gov.et/',
    content: JSON.stringify([
      'Developed and maintained core features for enterprise-level antivirus software on-site',
      'Improved antivirus engine detection rates by 30% through ML-based research and implementation',
      'Designed a web-based subscription management system to enhance user experience and operational efficiency',
      'Conducted technical research on emerging cybersecurity threats and mitigation strategies',
      'Mentored junior developers and led code review processes to maintain high development standards',
    ]),
  },
  {
    title: 'Full Stack Developer',
    company: 'Agents 4 Hire LLC',
    location: 'San Francisco, CA (Remote)',
    range: '3 Months (2025)',
    url: 'https://alphamail.ai',
    content: JSON.stringify([
      'Contributed to end-to-end development of AlphaMail, an AI-powered email intelligence platform',
      'Built and optimized AI agents for email categorization, summarization, task extraction, and drafting',
      'Implemented scalable backend and frontend components with seamless AI pipeline integration',
      'Designed role-aware logic and secure data-handling mechanisms to maintain user privacy',
      'Collaborated with cross-functional teams on rapid development cycles to deliver high-impact features',
    ]),
  },
]

export default function Experience({ jobs }: Props) {
  const { ref, inView } = useInView()
  const [activeIdx, setActiveIdx] = useState(0)

  const data = jobs.length > 0 ? jobs : FALLBACK_JOBS as Job[]
  const active = data[activeIdx]
  const bullets = parseContent(active.content)

  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-28" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <div className="section-heading">
          <span className="section-number">02.</span>
          <h2 id="experience-heading">Professional Experience</h2>
          <div className="line" />
        </div>

        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Tab list */}
          <div
            className="flex md:flex-col overflow-x-auto md:overflow-x-visible"
            role="tablist"
            aria-label="Job experiences"
            style={{
              minWidth: '220px',
              borderRight: '1px solid var(--border)',
              background: 'var(--bg)',
            }}
          >
            {data.map((job, i) => (
              <button
                key={job.id || i}
                role="tab"
                aria-selected={activeIdx === i}
                aria-controls={`job-panel-${i}`}
                id={`job-tab-${i}`}
                onClick={() => setActiveIdx(i)}
                className="relative text-left px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap md:whitespace-normal"
                style={{
                  color: activeIdx === i ? 'var(--primary)' : 'var(--text-muted)',
                  background: activeIdx === i ? 'var(--surface)' : 'transparent',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {activeIdx === i && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute left-0 top-0 bottom-0 w-0.5 md:w-0.5 md:h-full"
                    style={{ background: 'var(--primary)' }}
                  />
                )}
                <span className="block font-semibold" style={{ color: activeIdx === i ? 'var(--text)' : 'var(--text-muted)' }}>
                  {job.company}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--primary)', opacity: activeIdx === i ? 1 : 0.5 }}>
                  {job.title.split(' ').slice(0, 2).join(' ')}
                </span>
              </button>
            ))}
          </div>

          {/* Panel */}
          <div
            className="flex-1 p-8 md:p-10"
            role="tabpanel"
            id={`job-panel-${activeIdx}`}
            aria-labelledby={`job-tab-${activeIdx}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Title & company */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                    {active.title}{' '}
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-underline"
                      style={{ color: 'var(--primary)' }}
                    >
                      @ {active.company} <ExternalLink size={12} className="inline" />
                    </a>
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      <span className="font-mono">{active.range}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      {active.location}
                    </span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="space-y-3">
                  {bullets.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex gap-3 text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ChevronRight
                        size={14}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: 'var(--primary)' }}
                      />
                      <span>{point.replace(/^- /, '')}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
