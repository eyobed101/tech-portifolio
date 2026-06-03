import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Mail, Shield, Code2, ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './SocialIcons'
import type { Profile } from '../types'

interface Props { profile: Profile | null }

export default function Hero({ profile }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    const COUNT = 55

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      })
    }

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark'

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dark = isDark()
      const nodeColor = dark ? 'rgba(59,130,246,0.7)' : 'rgba(37,99,235,0.5)'
      const lineColor = dark ? 'rgba(59,130,246,0.12)' : 'rgba(37,99,235,0.08)'

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = nodeColor
        ctx.fill()
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 1 - dist / 130
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
  }

  const socialLinks = [
    { href: profile?.github || 'https://github.com/eyobed101', icon: <GithubIcon size={18} />, label: 'GitHub' },
    { href: profile?.linkedin || 'https://linkedin.com/in/eyobed-e-61b39b194', icon: <LinkedinIcon size={18} />, label: 'LinkedIn' },
    { href: `mailto:${profile?.email || 'eyobedeliast@gmail.com'}`, icon: <Mail size={18} />, label: 'Email' },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      <canvas ref={canvasRef} id="hero-canvas" aria-hidden="true" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }}
      />

      {/* Glow orbs */}
      <div aria-hidden="true" className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div aria-hidden="true" className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="container relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-24 pt-32"
        >
          {/* Text */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.p variants={item} className="font-mono text-sm mb-4" style={{ color: 'var(--primary)' }}>
              Hi, my name is
            </motion.p>

            <motion.h1 variants={item} className="font-extrabold leading-tight mb-3">
              <span style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: 'var(--text)', letterSpacing: '-0.02em', display: 'block' }}>
                {profile?.name || 'Eyobed Elias'}
              </span>
            </motion.h1>

            <motion.h2
              variants={item}
              className="font-bold leading-tight mb-6"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', color: 'var(--text-muted)', letterSpacing: '-0.01em' }}
            >
              Building Secure Software &amp;{' '}
              <span className="gradient-text">Defending Modern Infrastructure</span>
            </motion.h2>

            <motion.p variants={item} className="text-base leading-relaxed mb-8 mx-auto lg:mx-0 max-w-xl" style={{ color: 'var(--text-muted)' }}>
              {profile?.description || "I'm a software developer and CTO specializing in building secure, scalable systems. Currently leading technical innovation at Tripways while contributing to national cybersecurity systems at INSA."}
            </motion.p>

            {/* Role badges */}
            <motion.div variants={item} className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              {[
                { icon: <Code2 size={14} />, label: 'Software Development' },
                { icon: <Shield size={14} />, label: 'Cybersecurity' },
              ].map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--primary)' }}>{icon}</span>
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <a href="#work" onClick={e => { e.preventDefault(); document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-primary">
                View My Work <ExternalLink size={16} />
              </a>
              <a href="#contact" onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-outline">
                Get In Touch
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div variants={item} className="flex gap-4 justify-center lg:justify-start">
              {socialLinks.map(({ href, icon, label }) => (
                <a key={label} href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  {icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Avatar */}
          <motion.div variants={item} className="flex-shrink-0">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{ background: 'conic-gradient(from 0deg, var(--primary), var(--secondary), transparent, var(--primary))', padding: '3px' }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 60px var(--glow)' }} aria-hidden="true" />
              <div className="absolute inset-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                {profile?.aboutImage ? (
                  <img src={profile.aboutImage} alt="Eyobed Elias" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                    <Shield size={64} style={{ color: 'var(--primary)', opacity: 0.4 }} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="flex flex-col items-center gap-2 pb-8" aria-hidden="true">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown size={20} style={{ color: 'var(--text-muted)' }} />
          </motion.div>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>scroll</span>
        </motion.div>
      </div>
    </section>
  )
}
