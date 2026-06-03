import axios from 'axios'
import type { Profile, Job, Project, FeaturedProject, Post } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({ baseURL: BASE_URL })

export const fetchProfile = (): Promise<Profile> =>
  api.get('/api/profile').then(r => r.data)

export const fetchJobs = (): Promise<Job[]> =>
  api.get('/api/jobs').then(r => r.data)

export const fetchProjects = (): Promise<Project[]> =>
  api.get('/api/projects').then(r => r.data)

export const fetchFeatured = (): Promise<FeaturedProject[]> =>
  api.get('/api/featured').then(r => r.data)

export const fetchPosts = (): Promise<Post[]> =>
  api.get('/api/posts').then(r => r.data)

export const fetchPost = (slug: string): Promise<Post> =>
  api.get(`/api/posts/${slug}`).then(r => r.data)

// Parse JSON fields safely
export const parseTech = (tech: string): string[] => {
  try { return JSON.parse(tech) } catch { return [] }
}

export const parseTags = (tags: string): string[] => {
  try { return JSON.parse(tags) } catch { return [] }
}

export const parseContent = (content: string): string[] => {
  try { return JSON.parse(content) } catch { return [content] }
}

export const parseSkills = (skills?: string) => {
  if (!skills) return []
  try { return JSON.parse(skills) } catch { return [] }
}

// Reading time estimate
export const readingTime = (content: string): number => {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
