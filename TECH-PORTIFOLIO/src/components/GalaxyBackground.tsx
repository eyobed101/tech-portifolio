import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  speed: number   // upward drift speed
  twinklePhase: number
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

    const isDark = () =>
      document.documentElement.getAttribute('data-theme') !== 'light'

    const initStars = (w: number, h: number) => {
      // Spread stars over 3× the page height so they're always flowing
      stars = Array.from({ length: 260 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 3,
        radius: Math.random() * 1.4 + 0.2,
        opacity: Math.random() * 0.55 + 0.1,
        speed: Math.random() * 0.18 + 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.012 + 0.004,
      }))
    }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
      initStars(canvas.width, canvas.height)
    }

    resize()

    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(document.documentElement)

    let tick = 0

    const draw = () => {
      tick++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dark = isDark()
      // Use very subtle colours — visible but never distracting
      const starColor = dark ? '180,210,255' : '59,130,246'

      stars.forEach(s => {
        // drift upward, wrap around
        s.y -= s.speed
        if (s.y < -4) s.y = canvas.height + 4

        // gentle twinkle
        s.twinklePhase += s.twinkleSpeed
        const twinkle = 0.5 + 0.5 * Math.sin(s.twinklePhase)
        const alpha = s.opacity * twinkle * (dark ? 0.7 : 0.35)

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${starColor},${alpha.toFixed(3)})`
        ctx.fill()
      })

      // sparse larger "nebula" glow dots — very faint
      if (tick % 3 === 0) {
        stars.filter(s => s.radius > 1.2).forEach(s => {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 6)
          grd.addColorStop(0, `rgba(${starColor},${(s.opacity * 0.08).toFixed(3)})`)
          grd.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.radius * 6, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      resizeObs.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
