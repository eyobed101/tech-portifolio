import React from 'react';
import { Link, graphql } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  h1 {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 50px;

    a {
      font-size: var(--fz-lg);
      font-weight: 400;
    }
  }

  ul {
    li {
      font-size: 24px;
      h2 {
        font-size: inherit;
        margin: 0;
        a {
          color: var(--light-slate);
        }
      }
      .subtitle {
        color: var(--slate);
        font-size: var(--fz-sm);

        .tag {
          margin-right: 10px;
        }
      }
    }
  }
`;

import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { posts as fallbackPosts } from '../fallbackData';

const TagTemplate = ({ pageContext, data, location, params }) => {
  // Support both old static pages (pageContext.tag) and new catch-all client routes (URL)
  const tagFromUrl =
    (params && params['*']) ||
    (location &&
      location.pathname
        .replace(/^\/pensieve\/tags\//, '')
        .replace(/\/$/, ''));
  const tag = pageContext?.tag || tagFromUrl || '';

  const buildEdges = data?.allMarkdownRemark?.edges || [];

  const { data: posts = [] } = useQuery(['posts-tag', tag], async () => {
    const res = await api.get('/api/posts');
    const allPosts = res.data.filter(p => !p.draft);
    return allPosts.filter(p => {
      let tagsList = [];
      try {
        tagsList = JSON.parse(p.tags || '[]');
      } catch (e) {
        tagsList = p.tags ? p.tags.split(',').map(t => t.trim()) : [];
      }
      // Match by original tag name or kebab-cased version
      return tagsList.some(
        t => t === tag || t.toLowerCase() === tag.toLowerCase() ||
          require('lodash/kebabCase')(t) === tag
      );
    });
  }, { enabled: !!tag });

  return (
    <Layout location={location}>
      <Helmet title={`Tagged: #${tag}`} />

      <StyledTagsContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/pensieve">All memories</Link>
        </span>

        <h1>
          <span>#{tag}</span>
          <span>
            <Link to="/pensieve/tags">View all tags</Link>
          </span>
        </h1>

        <ul className="fancy-list">
          {posts.map(post => {
            const { title, slug, date, tags } = post;
            const isPrefixed = slug.startsWith('/pensieve/');
            const formattedSlug = isPrefixed ? slug : `/pensieve/${slug.replace(/^\//, '')}`;
            let parsedTags = [];
            try {
              parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (e) {
              parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
            }

            return (
              <li key={slug}>
                <h2>
                  <Link to={formattedSlug}>{title}</Link>
                </h2>
                <p className="subtitle">
                  <time>
                    {new Date(date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span>&nbsp;&mdash;&nbsp;</span>
                  {parsedTags &&
                    parsedTags.length > 0 &&
                    parsedTags.map((t, i) => (
                      <Link key={i} to={`/pensieve/tags/${kebabCase(t)}/`} className="tag">
                        #{t}
                      </Link>
                    ))}
                </p>
              </li>
            );
          })}
        </ul>
      </StyledTagsContainer>
    </Layout>
  );
};

export default TagTemplate;

TagTemplate.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string,
  }),
  data: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object,
};

// Optional query—when rendered via the catch-all matchPath no tag is passed
export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            description
            date
            slug
            tags
          }
        }
      }
    }
  }
`;
