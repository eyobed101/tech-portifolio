const profile = {
    id: "singleton",
    name: "Eyobed Elias",
    intro: "I build secure digital experiences.",
    description: "I'm a software developer and CTO specializing in building secure, scalable systems across multiple platforms. Currently leading technical innovation at Tripways while contributing to national cybersecurity systems at INSA.",
    resumeUrl: "https://endpoint.eyobedelias.net.et/uploads/1777320343874-114031482.pdf",
    aboutTitle: "About Me",
    aboutContent: "Hello! I’m Eyobed—a developer who crafts digital experiences with purpose. My fascination began when I first merged logic and creativity through code. Today, I build full-stack applications that balance elegant interfaces with resilient backends, fueled by a love for problem-solving and a drive to make technology meaningful.",
    email: "eyobedeliast@gmail.com",
    github: "https://github.com/eyobed101",
    linkedin: "https://www.linkedin.com/in/eyobed-e-61b39b194",
    twitter: "https://twitter.com/eyobedelias",
    instagram: "https://www.instagram.com/eyobed",
    codepen: "https://codepen.io/eyobed101",
};

const jobs = [
    {
        id: "job1",
        company: "Tripways",
        location: "Addis Ababa, Ethiopia",
        range: "May 2023 - Present",
        title: "Chief Technology Officer (CTO)",
        url: "https://tripways.com.et/",
        content: JSON.stringify(["Lead technical innovation", "Engineering management"])
    }
];

const projects = [
    {
        id: "proj1",
        title: "Secure Auth Gateway",
        github: "https://github.com/eyobed101",
        external: "#",
        tech: JSON.stringify(["Node.js", "JWT", "Redis"]),
        content: "A high-security authentication gateway.",
        showInProjects: true
    }
];

const featured = [
    {
        id: "feat1",
        title: "Tripways Platform",
        cover: "https://endpoint.eyobedelias.net.et/uploads/1777320352001-49544608.jpg",
        github: "https://github.com/eyobed101",
        external: "https://tripways.com.et/",
        tech: JSON.stringify(["React", "Node.js", "AWS"]),
        content: "The leading travel platform in Ethiopia."
    }
];

const posts = [
    {
        id: "post1",
        title: "Building Secure Systems",
        description: "Lessons learned from building national-scale cybersecurity applications.",
        slug: "building-secure-systems",
        date: "2024-01-01",
        tags: JSON.stringify(["Security", "Architecture"]),
        content: "<h1>Building Secure Systems</h1><p>Security is not an afterthought...</p>"
    }
];

module.exports = {
    profile,
    jobs,
    projects,
    featured,
    posts
};
