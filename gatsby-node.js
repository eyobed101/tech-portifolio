require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const _ = require('lodash');
const axios = require('axios');
const crypto = require('crypto');

const {
  profile: fallbackProfile,
  jobs: fallbackJobs,
  projects: fallbackProjects,
  featured: fallbackFeatured,
  posts: fallbackPosts,
} = require('./src/fallbackDataNode');

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;
  const API_URL = process.env.GATSBY_API_URL || 'http://localhost:3001';

  const createDatabaseNode = (data, type) => {
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

  // Fetch live data from API and create nodes
  const fetchAndCreateNodes = async (endpoint, type, fallbackData) => {
    try {
      const res = await axios.get(`${API_URL}${endpoint}`);
      const dataList = Array.isArray(res.data) ? res.data : [res.data];
      if (dataList.length > 0) {
        dataList.forEach(item => createDatabaseNode(item, type));
        return;
      }
    } catch (e) {
      reporter.warn(`Could not fetch ${type} from ${endpoint}, using fallback data: ${e.message}`);
    }
    // Fallback if API fails or is empty
    if (Array.isArray(fallbackData)) {
      fallbackData.forEach(item => createDatabaseNode(item, type));
    } else if (fallbackData) {
      createDatabaseNode(fallbackData, type);
    }
  };

  await Promise.all([
    fetchAndCreateNodes('/api/projects', 'DatabaseProject', fallbackProjects),
    fetchAndCreateNodes('/api/featured', 'DatabaseFeatured', fallbackFeatured),
    fetchAndCreateNodes('/api/jobs', 'DatabaseJob', fallbackJobs),
    fetchAndCreateNodes('/api/posts', 'DatabasePost', fallbackPosts),
    fetchAndCreateNodes('/api/profile', 'DatabaseProfile', fallbackProfile),
  ]);
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
      createdAt: Date @dateformat
      updatedAt: Date @dateformat
    }

    type DatabaseProject implements Node {
      title: String
      github: String
      external: String
      tech: String
      cover: String
      company: String
      showInProjects: Boolean
      content: String
      createdAt: Date @dateformat
      updatedAt: Date @dateformat
    }

    type DatabaseFeatured implements Node {
      title: String
      cover: String
      github: String
      external: String
      tech: String
      content: String
      createdAt: Date @dateformat
      updatedAt: Date @dateformat
    }

    type DatabaseJob implements Node {
      title: String
      company: String
      location: String
      range: String
      url: String
      content: String
      createdAt: Date @dateformat
      updatedAt: Date @dateformat
    }

    type DatabasePost implements Node {
      title: String
      description: String
      date: Date @dateformat
      draft: Boolean
      slug: String
      tags: String
      content: String
      cover: String
      createdAt: Date @dateformat
      updatedAt: Date @dateformat
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

  // Generate static pages for all posts for full SEO support
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
      try {
        const tags = typeof node.tags === 'string' ? JSON.parse(node.tags) : node.tags;
        tags.forEach(tag => tagsSet.add(tag));
      } catch (e) {
        // Handle comma separated tags if they are not JSON
        node.tags.split(',').forEach(tag => tagsSet.add(tag.trim()));
      }
    }
  });

  // Generate static pages for each tag
  tagsSet.forEach(tag => {
    createPage({
      path: `/pensieve/tags/${_.kebabCase(tag)}/`,
      component: tagTemplate,
      context: {
        tag: tag,
      },
    });
  });

  // Re-add client-only catch-all routes as a fallback
  // This ensures that if a post or tag wasn't created statically (e.g. added after build
  // or build-time API issues), it still works client-side via React Query.
  createPage({
    path: '/pensieve/post',
    matchPath: '/pensieve/:slug',
    component: postTemplate,
    context: {},
  });

  createPage({
    path: '/pensieve/tags/all',
    matchPath: '/pensieve/tags/*',
    component: tagTemplate,
    context: {},
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
