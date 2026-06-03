import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  alpha: number
  speed: number
  twinkle: number
  twinkleSpeed: number
}

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let stars: Star[] = []
    let W = 0
    let H = 0

    const isDark = () =>
      document.documentElement.getAttribute('data-theme') !== 'light'

    const build = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W
      canvas.height = H
      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        radius: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.06,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
      }))
    }

    build()
    window.addEventListener('resize', build)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      const dark = isDark()
      // bright enough to be clearly visible against both themes
      const rgb = dark ? '160,200,255' : '99,140,240'
      const mult = dark ? 1 : 0.6

      for (const s of stars) {
        // drift upward
        s.y -= s.speed
        if (s.y + s.radius < 0) {
          s.y = H + s.radius
          s.x = Math.random() * W
        }

        s.twinkle += s.twinkleSpeed
        const brightness = s.alpha * mult * (0.55 + 0.45 * Math.sin(s.twinkle))

        // core dot
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${brightness.toFixed(3)})`
        ctx.fill()

        // soft halo on bigger stars
        if (s.radius > 1.1) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 5)
          g.addColorStop(0, `rgba(${rgb},${(brightness * 0.18).toFixed(3)})`)
          g.addColorStop(1, `rgba(${rgb},0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.radius * 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', build)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
