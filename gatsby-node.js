/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const _ = require('lodash');
const axios = require('axios');
const crypto = require('crypto');

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error.message);
      return [];
    }
  };

  const API_URL = process.env.GATSBY_API_URL || 'http://localhost:3001';

  const projects = await fetchData(`${API_URL}/api/projects`);
  const featured = await fetchData(`${API_URL}/api/featured`);
  const jobs = await fetchData(`${API_URL}/api/jobs`);
  const posts = await fetchData(`${API_URL}/api/posts`);
  const profile = await fetchData(`${API_URL}/api/profile`);

  const createDatabaseNode = (data, type) => {
    const nodeContent = JSON.stringify(data);
    const nodeMeta = {
      id: createNodeId(`${type}-${data.id || data.slug || 'single'}`),
      parent: null,
      children: [],
      internal: {
        type: type,
        mediaType: type === 'DatabasePost' ? `text/html` : `text/markdown`,
        content: data.content || '',
        contentDigest: createContentDigest(data),
      },
    };
    const node = Object.assign({}, data, nodeMeta);
    createNode(node);
  };

  projects.forEach(p => createDatabaseNode(p, 'DatabaseProject'));
  featured.forEach(f => createDatabaseNode(f, 'DatabaseFeatured'));
  jobs.forEach(j => createDatabaseNode(j, 'DatabaseJob'));
  posts.forEach(p => createDatabaseNode(p, 'DatabasePost'));
  if (profile && !Array.isArray(profile) && profile.id) {
    createDatabaseNode(profile, 'DatabaseProfile');
  } else {
    // Fallback if no profile data in backend to prevent GraphQL query failure
    createDatabaseNode({
      id: 'singleton',
      name: 'Eyobed Elias',
      intro: 'I build secure digital experiences.',
      description: "I'm a software developer and CTO specializing in building secure, scalable systems across multiple platforms. Currently leading technical innovation at Tripways while contributing to national cybersecurity systems at INSA.",
      aboutTitle: 'About Me',
      aboutContent: "Hello! I am a developer who crafts digital experiences with purpose.",
      aboutSkills: JSON.stringify([
        { category: 'Technologies', items: ['JavaScript', 'TypeScript', 'React', 'Node.js'] }
      ]),
      email: 'eyobedeliast@gmail.com',
      github: 'https://github.com/eyobed101',
      linkedin: 'https://www.linkedin.com/in/eyobed-e-61b39b194',
      twitter: 'https://twitter.com/eyobedelias',
      instagram: 'https://www.instagram.com/eyobed',
      codepen: 'https://codepen.io/eyobed101',
      resumeUrl: null
    }, 'DatabaseProfile');
  }
};


exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemarkFrontmatter {
      ios: String
      android: String
      slug: String
      date: Date @dateformat
      tags: [String]
    }
    
    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
    }

    type DatabaseProfile implements Node {
      name: String
      intro: String
      description: String
      resumeUrl: String
      aboutTitle: String
      aboutContent: String
      aboutImage: String
      aboutSkills: String
      email: String
      github: String
      linkedin: String
      twitter: String
      instagram: String
      codepen: String
    }

    type DatabaseProject implements Node {
      title: String
      github: String
      external: String
      tech: String
      cover: String
      content: String
      showInProjects: Boolean
    }

    type DatabaseJob implements Node {
      title: String
      company: String
      location: String
      range: String
      url: String
      content: String
    }

    type DatabasePost implements Node {
      title: String
      date: Date @dateformat
      slug: String
      tags: String
      content: String
      cover: String
      draft: Boolean
    }
  `;
  createTypes(typeDefs);
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve(`src/templates/post.js`);
  const tagTemplate = path.resolve('src/templates/tag.js');

  const result = await graphql(`
    {
      posts: allDatabasePost(
        filter: { draft: { ne: true } }
        sort: { order: DESC, fields: [date] }
      ) {
        edges {
          node {
            slug
            tags
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const posts = result.data.posts.edges;
  const tagsSet = new Set();

  const postsPerPage = 6;
  const numPages = Math.ceil(posts.length / postsPerPage) || 1; // at least 1 page

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/pensieve` : `/pensieve/page/${i + 1}`,
      component: path.resolve('./src/templates/pensieve-list.js'),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });

  posts.forEach(({ node }) => {
    const isPrefixed = node.slug.startsWith('/pensieve/');
    const cleanSlug = node.slug.replace(/^\//, '');
    const normalizedPath = isPrefixed ? node.slug : `/pensieve/${cleanSlug}`;

    createPage({
      path: normalizedPath,
      component: postTemplate,
      context: {
        slug: node.slug,
      },
    });

    if (node.tags) {
      const tags = JSON.parse(node.tags);
      tags.forEach(tag => tagsSet.add(tag));
    }
  });

  tagsSet.forEach(tag => {
    createPage({
      path: `/pensieve/tags/${_.kebabCase(tag)}/`,
      component: tagTemplate,
      context: {
        tag: tag,
      },
    });
  });
};


exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scrollreveal/,
            use: loaders.null(),
          },
          {
            test: /animejs/,
            use: loaders.null(),
          },
          {
            test: /miniraf/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@fonts': path.resolve(__dirname, 'src/fonts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};
