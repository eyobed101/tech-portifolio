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

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

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

  // Use fallback data for build nodes to ensure stable schema and page creation
  // Components will fetch live data at runtime via TanStack Query
  fallbackProjects.forEach(p => createDatabaseNode(p, 'DatabaseProject'));
  fallbackFeatured.forEach(f => createDatabaseNode(f, 'DatabaseFeatured'));
  fallbackJobs.forEach(j => createDatabaseNode(j, 'DatabaseJob'));
  fallbackPosts.forEach(p => createDatabaseNode(p, 'DatabasePost'));
  if (fallbackProfile) {
    createDatabaseNode(fallbackProfile, 'DatabaseProfile');
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
