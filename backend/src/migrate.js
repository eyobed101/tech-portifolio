const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const prisma = new PrismaClient();

async function migrate() {
    const contentPath = path.join(__dirname, '../../content');

    // Migrate Jobs
    const jobsPath = path.join(contentPath, 'jobs');
    if (fs.existsSync(jobsPath)) {
        const jobDirs = fs.readdirSync(jobsPath);
        for (const dir of jobDirs) {
            const filePath = path.join(jobsPath, dir, 'index.md');
            if (fs.existsSync(filePath)) {
                const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
                await prisma.job.create({
                    data: {
                        title: data.title,
                        company: data.company,
                        location: data.location,
                        range: data.range,
                        url: data.url,
                        content: JSON.stringify(content.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace('-', '').trim())),
                    }
                });
            }
        }
    }

    // Migrate Projects (Other)
    const projectsPath = path.join(contentPath, 'projects');
    if (fs.existsSync(projectsPath)) {
        const projectFiles = fs.readdirSync(projectsPath);
        for (const file of projectFiles) {
            if (file.endsWith('.md')) {
                const { data, content } = matter(fs.readFileSync(path.join(projectsPath, file), 'utf8'));
                await prisma.project.create({
                    data: {
                        title: data.title,
                        github: data.github,
                        external: data.external,
                        tech: JSON.stringify(data.tech || []),
                        company: data.company,
                        showInProjects: data.showInProjects !== false,
                        content: content,
                    }
                });
            }
        }
    }

    // Migrate Featured Projects
    const featuredPath = path.join(contentPath, 'featured');
    if (fs.existsSync(featuredPath)) {
        const featuredDirs = fs.readdirSync(featuredPath);
        for (const dir of featuredDirs) {
            const filePath = path.join(featuredPath, dir, 'index.md');
            if (fs.existsSync(filePath)) {
                const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
                await prisma.featuredProject.create({
                    data: {
                        title: data.title,
                        cover: data.cover,
                        github: data.github,
                        external: data.external,
                        tech: JSON.stringify(data.tech || []),
                        content: content,
                    }
                });
            }
        }
    }

    // Migrate Posts
    const postsPath = path.join(contentPath, 'posts');
    if (fs.existsSync(postsPath)) {
        const postDirs = fs.readdirSync(postsPath);
        for (const dir of postDirs) {
            const filePath = path.join(postsPath, dir, 'index.md');
            if (fs.existsSync(filePath)) {
                const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
                await prisma.post.create({
                    data: {
                        title: data.title,
                        description: data.description,
                        date: new Date(data.date),
                        draft: data.draft || false,
                        slug: data.slug || dir,
                        tags: JSON.stringify(data.tags || []),
                        content: content,
                    }
                });
            }
        }
    }

    console.log('Migration complete!');
}

migrate()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
