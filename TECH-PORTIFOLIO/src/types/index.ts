export interface Profile {
  id: string
  name: string
  intro: string
  description: string
  resumeUrl?: string
  aboutTitle?: string
  aboutContent?: string
  aboutImage?: string
  aboutSkills?: string // JSON string
  email?: string
  github?: string
  linkedin?: string
  twitter?: string
  instagram?: string
  codepen?: string
}

export interface SkillCategory {
  category: string
  items: string[]
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  range: string
  url?: string
  content: string // JSON array of strings
  createdAt: string
}

export interface Project {
  id: string
  title: string
  cover?: string
  github?: string
  external?: string
  tech: string // JSON array
  company?: string
  showInProjects: boolean
  content?: string
  createdAt: string
}

export interface FeaturedProject {
  id: string
  title: string
  cover?: string
  github?: string
  external?: string
  tech: string // JSON array
  content?: string
  createdAt: string
}

export interface Post {
  id: string
  title: string
  cover?: string
  description?: string
  date: string
  draft: boolean
  slug: string
  tags: string // JSON array
  content: string
  createdAt: string
}
