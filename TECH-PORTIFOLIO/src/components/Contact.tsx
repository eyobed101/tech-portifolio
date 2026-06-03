import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../lib/hooks'
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Clock, ArrowUpRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './SocialIcons'
import type { Profile } from '../types'

interface Props { profile: Profile | null }
type FormState = 'idle' | 'submitting' | 'success' | 'error'

// Floating label input
function Field({
  id, label, error, children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-wide uppercase"
        style={{ color: 'var(--text-muted)', letterSpacing: '0.07em' }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="flex items-center gap-1 text-xs" style={{ color: '#ef4444' }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

const INPUT_STYLE = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  borderRadius: '0.75rem',
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
  padding: '0.75rem 1rem',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
} as React.CSSProperties

export default function Contact({ profile }: Props) {
  const { ref, inView } = useInView()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.subject.trim()) e.subject = 'Required'
    if (!form.message.trim()) e.message = 'Required'
    else if (form.message.trim().length < 10) e.message = 'Too short'
    return e
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStatus('submitting')
    await new Promise(r => setTimeout(r, 1000))
    window.location.href = `mailto:${profile?.email || 'eyobedeliast@gmail.com'}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`
    setStatus('success')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const upd = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [f]: e.target.value }))
    if (errors[f]) setErrors(p => ({ ...p, [f]: undefined }))
  }

  const focusStyle = (id: string, err?: string) => ({
    ...INPUT_STYLE,
    borderColor: focusedField === id ? 'var(--primary)' : err ? '#ef4444' : 'var(--border)',
    boxShadow: focusedField === id ? '0 0 0 3px var(--glow)' : 'none',
  })

  const channels = [
    {
      icon: <Mail size={16} />,
      label: 'Email',
      value: profile?.email || 'eyobedeliast@gmail.com',
      href: `mailto:${profile?.email || 'eyobedeliast@gmail.com'}`,
      color: '#3b82f6',
      note: 'Replies within 24h',
    },
    {
      icon: <GithubIcon size={16} />,
      label: 'GitHub',
      value: 'eyobed101',
      href: profile?.github || 'https://github.com/eyobed101',
      color: '#8b5cf6',
      note: 'Open source work',
    },
    {
      icon: <LinkedinIcon size={16} />,
      label: 'LinkedIn',
      value: 'Eyobed Elias',
      href: profile?.linkedin || 'https://linkedin.com/in/eyobed-e-61b39b194',
      color: '#0891b2',
      note: 'Professional network',
    },
    {
      icon: <MapPin size={16} />,
      label: 'Location',
      value: 'Addis Ababa, Ethiopia',
      href: null,
      color: '#10b981',
      note: 'UTC+3 timezone',
    },
  ]

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-28 relative overflow-hidden"
      style={{ background: 'var(--surface)' }}
    >
      {/* ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%', right: '-5%',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--glow) 0%, transparent 65%)',
          filter: 'blur(60px)',
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      <div className="container relative z-10">

        {/* ── Section heading ── */}
        <div className="section-heading">
          <span className="section-number">05.</span>
          <h2 id="contact-heading">Get In Touch</h2>
          <div className="line" />
        </div>

        {/* ── Hero text ── */}
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-14"
        >
          <h3
            className="font-extrabold leading-tight mb-4"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            Let's build something{' '}
            <span className="gradient-text">exceptional</span> together.
          </h3>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Whether it's a security challenge, a full-stack product, or a conversation about technology — I'm always open. Drop a message and I'll get back to you promptly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* ── Left: availability + channels ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* availability card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: 'var(--primary)' }}>current status</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Open to opportunities</p>
                </div>
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#10b981', display: 'inline-block' }}
                  />
                  Available
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: <Clock size={13} />, label: 'Response time', value: '< 24 hours' },
                  { icon: <MapPin size={13} />, label: 'Timezone', value: 'UTC+3 (EAT)' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--primary)' }}>{icon}</span> {label}
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* channel cards */}
            <div className="space-y-2.5">
              {channels.map(({ icon, label, value, href, color, note }) => {
                const inner = (
                  <>
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: color + '18', color }}
                    >
                      {icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{value}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{note}</span>
                      {href && <ArrowUpRight size={13} style={{ color }} />}
                    </div>
                  </>
                )

                const sharedProps = {
                  className: 'flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200',
                  style: { background: 'var(--bg)', border: '1px solid var(--border)' } as React.CSSProperties,
                  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.borderColor = color + '55'
                    e.currentTarget.style.boxShadow = `0 4px 20px ${color}18`
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  },
                  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  },
                }

                return href ? (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer" aria-label={`${label}: ${value}`} {...sharedProps}>
                    {inner}
                  </a>
                ) : (
                  <div key={label} {...sharedProps}>{inner}</div>
                )
              })}
            </div>
          </motion.div>

          {/* ── Right: form ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
              className="rounded-2xl p-8"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              {/* top accent line */}
              <div
                className="h-px mb-8 -mx-8 -mt-8 rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary), transparent)' }}
                aria-hidden="true"
              />

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field id="contact-name" label="Full Name" error={errors.name}>
                  <input
                    id="contact-name" type="text" value={form.name}
                    onChange={upd('name')} placeholder="Eyobed Elias" required
                    style={focusStyle('contact-name', errors.name)}
                    onFocus={() => setFocusedField('contact-name')}
                    onBlur={() => setFocusedField(null)}
                    aria-invalid={!!errors.name}
                  />
                </Field>
                <Field id="contact-email" label="Email Address" error={errors.email}>
                  <input
                    id="contact-email" type="email" value={form.email}
                    onChange={upd('email')} placeholder="you@example.com" required
                    style={focusStyle('contact-email', errors.email)}
                    onFocus={() => setFocusedField('contact-email')}
                    onBlur={() => setFocusedField(null)}
                    aria-invalid={!!errors.email}
                  />
                </Field>
              </div>

              <div className="mb-5">
                <Field id="contact-subject" label="Subject" error={errors.subject}>
                  <input
                    id="contact-subject" type="text" value={form.subject}
                    onChange={upd('subject')} placeholder="Project inquiry, collaboration…" required
                    style={focusStyle('contact-subject', errors.subject)}
                    onFocus={() => setFocusedField('contact-subject')}
                    onBlur={() => setFocusedField(null)}
                    aria-invalid={!!errors.subject}
                  />
                </Field>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="contact-message"
                    className="text-xs font-semibold tracking-wide uppercase"
                    style={{ color: 'var(--text-muted)', letterSpacing: '0.07em' }}>
                    Message
                  </label>
                  <span className="text-xs font-mono" style={{ color: form.message.length > 20 ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {form.message.length} chars
                  </span>
                </div>
                <textarea
                  id="contact-message" rows={6} value={form.message}
                  onChange={upd('message')}
                  placeholder="Tell me about your project, the challenge you're facing, or simply say hello…"
                  required
                  style={{ ...focusStyle('contact-message', errors.message), resize: 'vertical' }}
                  onFocus={() => setFocusedField('contact-message')}
                  onBlur={() => setFocusedField(null)}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p role="alert" className="flex items-center gap-1 mt-1 text-xs" style={{ color: '#ef4444' }}>
                    <AlertCircle size={11} /> {errors.message}
                  </p>
                )}
              </div>

              {/* success / error banners */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 mb-5 p-4 rounded-xl text-sm"
                  style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <CheckCircle size={16} />
                  <span>Message sent! I'll get back to you within 24 hours.</span>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 mb-5 p-4 rounded-xl text-sm"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
                >
                  <AlertCircle size={16} />
                  <span>Something went wrong. Please try again or email me directly.</span>
                </motion.div>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: status === 'submitting'
                    ? 'var(--surface-2)'
                    : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  color: status === 'submitting' ? 'var(--text-muted)' : '#fff',
                  border: 'none',
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  boxShadow: status === 'submitting' ? 'none' : '0 4px 24px var(--glow)',
                }}
                onMouseEnter={e => { if (status !== 'submitting') e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                aria-busy={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: 'var(--text-muted)', borderTopColor: 'transparent' }}
                      aria-hidden="true"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-center mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                Or reach me directly at{' '}
                <a
                  href={`mailto:${profile?.email || 'eyobedeliast@gmail.com'}`}
                  className="hover-underline font-medium"
                  style={{ color: 'var(--primary)' }}
                >
                  {profile?.email || 'eyobedeliast@gmail.com'}
                </a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
