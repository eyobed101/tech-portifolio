import { motion } from 'framer-motion'
import { useInView } from '../lib/hooks'
import { parseSkills } from '../lib/api'
import { CheckCircle2, User } from 'lucide-react'
import type { Profile, SkillCategory } from '../types'

interface Props { profile: Profile | null }

export default function About({ profile }: Props) {
  const { ref, inView } = useInView()

  const skills: SkillCategory[] = parseSkills(profile?.aboutSkills)

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
  }

  return (
    <section id="about" aria-labelledby="about-heading" className="py-28">
      <div className="container">
        {/* Heading */}
        <div className="section-heading">
          <span className="section-number">01.</span>
          <h2 id="about-heading">About Me</h2>
          <div className="line" />
        </div>

        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-5 gap-12 lg:gap-16"
        >
          {/* Bio */}
          <div className="lg:col-span-3 space-y-5">
            <motion.p variants={itemVariants} className="text-base leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
              Hello! I'm <strong style={{ color: 'var(--text)' }}>Eyobed</strong> — a developer who crafts digital experiences with purpose. My fascination began when I first merged logic and creativity through code. Today, I build full-stack applications that balance elegant interfaces with resilient backends, fueled by a love for problem-solving and a drive to make technology meaningful.
            </motion.p>
            <motion.p variants={itemVariants} className="text-base leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
              Fast-forward to today, and I've had the privilege of working at a{' '}
              <strong style={{ color: 'var(--text)' }}>national cybersecurity agency</strong>, a{' '}
              <strong style={{ color: 'var(--text)' }}>start-up</strong>, a{' '}
              <strong style={{ color: 'var(--text)' }}>fintech company</strong>, and an{' '}
              <strong style={{ color: 'var(--text)' }}>AI platform</strong>. My main focus these days is building accessible, secure products and digital experiences at the intersection of software engineering and cybersecurity.
            </motion.p>
            <motion.p variants={itemVariants} className="text-base leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
              When I'm not writing code, I'm researching emerging threats, contributing to national security infrastructure, and exploring the intersection of technology and reformed theology.
            </motion.p>

            {/* Key highlights */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-4 pt-4">
              {[
                { value: '4+', label: 'Years Experience' },
                { value: '15+', label: 'Projects Shipped' },
                { value: '3', label: 'Active Roles' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl text-center"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div className="text-2xl font-bold mb-1 gradient-text">{value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Skills */}
          <div className="lg:col-span-2 space-y-5">
            {/* Avatar card */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-2xl overflow-hidden mb-6"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {profile?.aboutImage ? (
                <img
                  src={profile.aboutImage}
                  alt="Eyobed Elias"
                  className="w-full h-56 object-cover object-top"
                />
              ) : (
                <div
                  className="w-full h-48 flex items-center justify-center"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <User size={48} style={{ color: 'var(--primary)', opacity: 0.4 }} />
                </div>
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--surface) 0%, transparent 50%)' }} />
            </motion.div>

            {/* Skills grid */}
            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Technologies I work with:
              </p>
              {skills.length > 0 ? (
                skills.map((cat: SkillCategory) => (
                  <div key={cat.category}>
                    <p className="text-xs font-mono mb-2" style={{ color: 'var(--primary)' }}>{cat.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item: string) => (
                        <span key={item} className="flex items-center gap-1 tech-tag">
                          <CheckCircle2 size={10} />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // fallback static skills
                [
                  { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'PHP'] },
                  { category: 'Frontend', items: ['React.js', 'Next.js', 'React Native'] },
                  { category: 'Backend', items: ['Node.js', 'Laravel', 'Flask'] },
                  { category: 'Security', items: ['HMAC Auth', 'OAuth 2.0', 'JWT'] },
                ].map(cat => (
                  <div key={cat.category}>
                    <p className="text-xs font-mono mb-2" style={{ color: 'var(--primary)' }}>{cat.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map(item => (
                        <span key={item} className="flex items-center gap-1 tech-tag">
                          <CheckCircle2 size={10} /> {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
