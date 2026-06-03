import { useEffect, useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Work from './components/Work'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { fetchProfile, fetchJobs, fetchProjects, fetchFeatured, fetchPosts } from './lib/api'
import type { Profile, Job, Project, FeaturedProject, Post } from './types'

function PortfolioApp() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [featured, setFeatured] = useState<FeaturedProject[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    // Fetch all data in parallel; silently fall back to static data on error
    Promise.allSettled([
      fetchProfile().then(setProfile),
      fetchJobs().then(setJobs),
      fetchProjects().then(setProjects),
      fetchFeatured().then(setFeatured),
      fetchPosts().then(setPosts),
    ])
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] btn-primary"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero profile={profile} />
        <About profile={profile} />
        <Experience jobs={jobs} />
        <Work featured={featured} projects={projects} />
        <Blog posts={posts} />
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  )
}
