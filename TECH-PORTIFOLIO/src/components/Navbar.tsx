import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X, Shield } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useActiveSection } from '../lib/hooks'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

const SECTION_IDS = ['about', 'experience', 'work', 'blog', 'contact']

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.1)' : 'none',
        }}
        role="banner"
      >
        <div className="container">
          <nav
            className="flex items-center justify-between h-16 md:h-20"
            aria-label="Main navigation"
          >
            {/* Logo */}
            <a
              href="#hero"
              onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="flex items-center gap-2 group"
              aria-label="Eyobed Elias — home"
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                style={{ background: 'var(--primary)', boxShadow: '0 0 20px var(--glow)' }}
              >
                <Shield size={18} color="#fff" />
              </span>
              <span className="font-bold text-base hidden sm:block" style={{ color: 'var(--text)' }}>
                Eyobed<span style={{ color: 'var(--primary)' }}>.</span>
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }, i) => {
                const sectionId = href.replace('#', '')
                const isActive = active === sectionId
                return (
                  <a
                    key={label}
                    href={href}
                    onClick={e => { e.preventDefault(); handleNavClick(href) }}
                    className="relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
                    style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span
                      className="font-mono text-xs mr-1"
                      style={{ color: 'var(--primary)', opacity: 0.7 }}
                    >
                      0{i + 1}.
                    </span>
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ background: 'var(--primary)' }}
                      />
                    )}
                  </a>
                )
              })}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggle}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
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
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* Resume */}
              <a
                href="https://endpoint.eyobedelias.net.et/uploads/1777320343874-114031482.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block btn-outline text-sm py-2 px-4"
              >
                Resume
              </a>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col md:hidden"
              style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between p-5">
                <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>Navigation</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex flex-col p-5 gap-2" aria-label="Mobile navigation">
                {NAV_LINKS.map(({ label, href }, i) => (
                  <a
                    key={label}
                    href={href}
                    onClick={e => { e.preventDefault(); handleNavClick(href) }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span className="font-mono text-xs" style={{ color: 'var(--primary)' }}>0{i + 1}.</span>
                    {label}
                  </a>
                ))}
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <a
                    href="https://endpoint.eyobedelias.net.et/uploads/1777320343874-114031482.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full justify-center text-sm py-2.5"
                  >
                    Download Resume
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
