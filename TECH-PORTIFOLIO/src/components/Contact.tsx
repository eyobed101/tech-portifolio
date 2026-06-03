import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../lib/hooks'
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './SocialIcons'
import type { Profile } from '../types'

interface Props { profile: Profile | null }

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact({ profile }: Props) {
  const { ref, inView } = useInView()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const validate = () => {
    const errs: Partial<typeof form> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.subject.trim()) errs.subject = 'Subject is required'
    if (!form.message.trim()) errs.message = 'Message is required'
    else if (form.message.trim().length < 10) errs.message = 'Message too short'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStatus('submitting')
    // Simulate a form submission (mailto fallback)
    await new Promise(r => setTimeout(r, 1200))
    const mailto = `mailto:${profile?.email || 'eyobedeliast@gmail.com'}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`
    window.location.href = mailto
    setStatus('success')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const updateField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }))
  }

  const inputBase = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: '0.5rem',
  }

  const fieldClass = "w-full px-4 py-3 text-sm outline-none transition-all duration-200 rounded-lg"

  const socials = [
    { icon: <GithubIcon size={18} />, label: 'GitHub', href: profile?.github || 'https://github.com/eyobed101', display: 'eyobed101' },
    { icon: <LinkedinIcon size={18} />, label: 'LinkedIn', href: profile?.linkedin || 'https://linkedin.com/in/eyobed-e-61b39b194', display: 'Eyobed Elias' },
    { icon: <Mail size={18} />, label: 'Email', href: `mailto:${profile?.email || 'eyobedeliast@gmail.com'}`, display: profile?.email || 'eyobedeliast@gmail.com' },
    { icon: <MapPin size={18} />, label: 'Location', href: '#', display: 'Addis Ababa, Ethiopia' },
  ]

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-28">
      <div className="container">
        <div className="section-heading">
          <span className="section-number">05.</span>
          <h2 id="contact-heading">Get In Touch</h2>
          <div className="line" />
        </div>

        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-5 gap-12"
        >
          {/* Left — text + socials */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Let's Build Something Together
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Whether you have a project in mind, a security challenge to solve, or just want to connect — my inbox is always open. I'll do my best to get back to you promptly.
              </p>
            </div>

            <div className="space-y-3">
              {socials.map(({ icon, label, href, display }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--glow)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                  aria-label={`${label}: ${display}`}
                >
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                    style={{ background: 'var(--surface-2)', color: 'var(--primary)' }}
                  >
                    {icon}
                  </span>
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{display}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
              className="rounded-2xl p-8"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Full Name <span aria-hidden="true" style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={updateField('name')}
                    placeholder="Eyobed Elias"
                    required
                    className={fieldClass}
                    style={{ ...inputBase, borderColor: errors.name ? '#ef4444' : 'var(--border)' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={e => (e.target.style.borderColor = errors.name ? '#ef4444' : 'var(--border)')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && <p id="name-error" role="alert" className="mt-1 text-xs" style={{ color: '#ef4444' }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Email Address <span aria-hidden="true" style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={updateField('email')}
                    placeholder="you@example.com"
                    required
                    className={fieldClass}
                    style={{ ...inputBase, borderColor: errors.email ? '#ef4444' : 'var(--border)' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={e => (e.target.style.borderColor = errors.email ? '#ef4444' : 'var(--border)')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && <p id="email-error" role="alert" className="mt-1 text-xs" style={{ color: '#ef4444' }}>{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div className="mb-5">
                <label htmlFor="contact-subject" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Subject <span aria-hidden="true" style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={updateField('subject')}
                  placeholder="Project inquiry, collaboration, etc."
                  required
                  className={fieldClass}
                  style={{ ...inputBase, borderColor: errors.subject ? '#ef4444' : 'var(--border)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.target.style.borderColor = errors.subject ? '#ef4444' : 'var(--border)')}
                  aria-invalid={!!errors.subject}
                />
                {errors.subject && <p role="alert" className="mt-1 text-xs" style={{ color: '#ef4444' }}>{errors.subject}</p>}
              </div>

              {/* Message */}
              <div className="mb-6">
                <label htmlFor="contact-message" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Message <span aria-hidden="true" style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={updateField('message')}
                  placeholder="Tell me about your project or how I can help…"
                  required
                  className={fieldClass}
                  style={{ ...inputBase, resize: 'vertical', borderColor: errors.message ? '#ef4444' : 'var(--border)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.target.style.borderColor = errors.message ? '#ef4444' : 'var(--border)')}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p role="alert" className="mt-1 text-xs" style={{ color: '#ef4444' }}>{errors.message}</p>}
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                  <CheckCircle size={16} /> Message sent! I'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  <AlertCircle size={16} /> Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full justify-center"
                aria-busy={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
