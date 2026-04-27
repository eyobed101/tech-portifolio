import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Helper to handle async routes
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Auth Middleware
const authMiddleware = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err: any) {
        console.error('JWT Error:', err.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// --- Auth Routes ---
app.post('/api/auth/login', asyncHandler(async (req: any, res: any) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
}));

// --- Projects ---
app.get('/api/projects', asyncHandler(async (req: any, res: any) => {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(projects);
}));

app.post('/api/projects', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const project = await prisma.project.create({ data: req.body });
    res.json(project);
}));

app.put('/api/projects/:id', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const project = await prisma.project.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(project);
}));

app.delete('/api/projects/:id', authMiddleware, asyncHandler(async (req: any, res: any) => {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
}));

// --- Featured ---
app.get('/api/featured', asyncHandler(async (req: any, res: any) => {
    const featured = await prisma.featuredProject.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(featured);
}));

app.post('/api/featured', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const featured = await prisma.featuredProject.create({ data: req.body });
    res.json(featured);
}));

app.put('/api/featured/:id', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const featured = await prisma.featuredProject.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(featured);
}));

app.delete('/api/featured/:id', authMiddleware, asyncHandler(async (req: any, res: any) => {
    await prisma.featuredProject.delete({ where: { id: req.params.id } });
    res.status(204).send();
}));

// --- Jobs ---
app.get('/api/jobs', asyncHandler(async (req: any, res: any) => {
    const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(jobs);
}));

app.post('/api/jobs', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const job = await prisma.job.create({ data: req.body });
    res.json(job);
}));

app.put('/api/jobs/:id', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const job = await prisma.job.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(job);
}));

app.delete('/api/jobs/:id', authMiddleware, asyncHandler(async (req: any, res: any) => {
    await prisma.job.delete({ where: { id: req.params.id } });
    res.status(204).send();
}));

// --- Posts ---
app.get('/api/posts', asyncHandler(async (req: any, res: any) => {
    const posts = await prisma.post.findMany({ orderBy: { date: 'desc' } });
    res.json(posts);
}));

app.post('/api/posts', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const post = await prisma.post.create({ data: req.body });
    res.json(post);
}));

app.put('/api/posts/:id', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const post = await prisma.post.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(post);
}));

app.delete('/api/posts/:id', authMiddleware, asyncHandler(async (req: any, res: any) => {
    await prisma.post.delete({ where: { id: req.params.id } });
    res.status(204).send();
}));

// --- Site Metadata ---
app.get('/api/metadata', asyncHandler(async (req: any, res: any) => {
    const metadata = await prisma.siteMetadata.findMany();
    res.json(metadata);
}));

app.put('/api/metadata/:key', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const metadata = await prisma.siteMetadata.upsert({
        where: { key: req.params.key },
        update: { value: req.body.value },
        create: { key: req.params.key, value: req.body.value },
    });
    res.json(metadata);
}));

// --- Profile (Hero & Resume) ---
app.get('/api/profile', asyncHandler(async (req: any, res: any) => {
    console.log('GET /api/profile request received');
    let profile = await prisma.profile.findUnique({ where: { id: 'singleton' } });

    if (!profile) {
        const initialSkills = [
            { category: 'Languages', items: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'PHP'] },
            { category: 'Frontend', items: ['React.js', 'Next.js', 'React Native'] },
            { category: 'Backend', items: ['Node.js (Express/NestJS)', 'Laravel', 'Flask'] },
            { category: 'Databases', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'PrismaORM'] },
            { category: 'DevOps', items: ['RabbitMQ', 'Docker', 'CI/CD', 'AWS'] },
            { category: 'Security', items: ['HMAC Auth', 'OAuth 2.0', 'JWT'] }
        ];

        const initialAboutContent = "Hello! I am a developer who crafts digital experiences with purpose.";

        profile = await prisma.profile.create({
            data: {
                id: 'singleton',
                name: 'Eyobed Elias',
                intro: 'I build secure digital experiences.',
                description: "I'm a software developer and CTO specializing in building secure, scalable systems across multiple platforms.",
                aboutTitle: 'About Me',
                aboutContent: initialAboutContent,
                aboutSkills: JSON.stringify(initialSkills),
                email: 'eyobedeliast@gmail.com',
                github: 'https://github.com/eyobed101',
                linkedin: 'https://www.linkedin.com/in/eyobed-e-61b39b194',
                twitter: 'https://twitter.com/eyobedelias',
                instagram: 'https://www.instagram.com/eyobed',
                codepen: 'https://codepen.io/eyobed101'
            }
        });
    }
    res.json(profile);
}));

app.put('/api/profile', authMiddleware, asyncHandler(async (req: any, res: any) => {
    const profile = await prisma.profile.upsert({
        where: { id: 'singleton' },
        update: req.body,
        create: { id: 'singleton', ...req.body },
    });
    res.json(profile);
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
