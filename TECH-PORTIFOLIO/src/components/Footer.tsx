import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from './SocialIcons'
import LogoMark from './LogoMark'
import type { Profile } from '../types'

interface Props { profile: Profile | null }

export default function Footer({ profile }: Props) {
  const socials = [
    { icon: <GithubIcon size={17} />, href: profile?.github || 'https://github.com/eyobed101', label: 'GitHub' },
    { icon: <LinkedinIcon size={17} />, href: profile?.linkedin || 'https://linkedin.com/in/eyobed-e-61b39b194', label: 'LinkedIn' },
    { icon: <TwitterIcon size={17} />, href: profile?.twitter || 'https://twitter.com/eyobedelias', label: 'Twitter' },
    { icon: <InstagramIcon size={17} />, href: profile?.instagram || 'https://instagram.com/eyobed', label: 'Instagram' },
    { icon: <Mail size={17} />, href: `mailto:${profile?.email || 'eyobedeliast@gmail.com'}`, label: 'Email' },
  ]

  return (
    <footer
      className="py-10 text-center"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
      role="contentinfo"
    >
      <div className="container">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <LogoMark size={32} />
          <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>
            Eyobed<span style={{ color: 'var(--primary)' }}>.</span>
          </span>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {socials.map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              {icon}
            </a>
          ))}
        </div>

        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Designed &amp; Built by{' '}
          <a
            href="https://github.com/eyobed101"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-underline font-medium"
            style={{ color: 'var(--primary)' }}
          >
            Eyobed Elias
          </a>
          {' '}· {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
