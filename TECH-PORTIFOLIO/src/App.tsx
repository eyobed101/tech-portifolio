import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Work from './components/Work'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Loader from './components/Loader'
import PostDetail from './pages/PostDetail'
import AllProjects from './pages/AllProjects'
import AllBlogs from './pages/AllBlogs'
import { fetchProfile, fetchJobs, fetchProjects, fetchFeatured, fetchPosts } from './lib/api'
import type { Profile, Job, Project, FeaturedProject, Post } from './types'

function usePortfolioData() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [featured, setFeatured] = useState<FeaturedProject[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    Promise.allSettled([
      fetchProfile().then(setProfile),
      fetchJobs().then(setJobs),
      fetchProjects().then(setProjects),
      fetchFeatured().then(setFeatured),
      fetchPosts().then(setPosts),
    ])
  }, [])

  return { profile, jobs, projects, featured, posts }
}

function PortfolioHome() {
  const { profile, jobs, projects, featured, posts } = usePortfolioData()

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

function ProjectsPage() {
  const { projects } = usePortfolioData()
  return <AllProjects projects={projects} />
}

function BlogsPage() {
  const { posts } = usePortfolioData()
  return <AllBlogs posts={posts} />
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleDone = useCallback(() => setLoaded(true), [])

  return (
    <BrowserRouter>
      <ThemeProvider>
        {/* Loader sits above everything; only shown once per session */}
        {!loaded && <Loader onDone={handleDone} />}

        {/* Content renders underneath — visible once loader fades out */}
        <div
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: loaded ? 'auto' : 'none',
          }}
        >
          <Routes>
            <Route path="/" element={<PortfolioHome />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/blog/:slug" element={<PostDetail />} />
            <Route path="*" element={<PortfolioHome />} />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}
