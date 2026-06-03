import React from 'react';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import { IconBookmark } from '@components/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 100px;
    text-align: center;

    a {
      &:hover,
      &:focus {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>⚡</text></svg>")
            20 0,
          auto;
      }
    }
  }

  footer {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    margin-top: 20px;
  }
`;
const StyledGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 15px;
  margin-top: 50px;
  position: relative;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;
const StyledPost = styled.li`
  transition: var(--transition);
  cursor: default;
  min-width: 300px;
  border-radius: 16px;
  overflow: hidden;

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .post__inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .post__inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    position: relative;
    height: 100%;
    padding: 0;
    border-radius: 16px;
    transition: var(--transition);
    background-color: rgba(17, 34, 64, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(100, 255, 218, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &:hover {
      border: 1px solid rgba(100, 255, 218, 0.3);
      background-color: rgba(17, 34, 64, 0.6);
    }
  }

  .post__image {
    width: 100%;
    height: 220px;
    background-color: var(--green);
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition);
      opacity: 0.8;
    }

    &:hover img {
      opacity: 1;
      transform: scale(1.05);
    }
  }

  .post__content {
    padding: 2rem 1.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .post__title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .post__desc {
    color: var(--light-slate);
    font-size: 17px;
  }

  .post__excerpt {
    color: var(--slate);
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    margin-top: 8px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post__read-more {
    ${({ theme }) => theme.mixins.inlineLink};
    margin-top: 20px;
    font-size: var(--fz-sm);
    font-weight: 600;
    width: fit-content;
  }

  .post__date {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    text-transform: uppercase;
  }

  ul.post__tags {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const StyledPagination = styled.div`
  ${({ theme }) => theme.mixins.flexBetween};
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid var(--lightest-navy);

  a {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:hover {
      color: var(--green-tint);
    }
    &.disabled {
      color: var(--lightest-navy);
      pointer-events: none;
    }
  }
`;

import { posts as fallbackPosts } from '../fallbackData';

const PensieveList = ({ location, data, pageContext }) => {
  const buildPosts = data.allDatabasePost.edges.map(({ node }) => node);
  const { currentPage, numPages, limit, skip } = pageContext;

  const { data: postsList = buildPosts.length > 0 ? buildPosts : fallbackPosts } = useQuery(['posts', currentPage], async () => {
    const res = await api.get('/api/posts');
    const allPosts = res.data.filter(p => !p.draft).sort((a, b) => new Date(b.date) - new Date(a.date));
    return allPosts.slice(skip, skip + limit);
  });

  const posts = postsList;

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? '/pensieve' : `/pensieve/page/${currentPage - 1}`;
  const nextPage = `/pensieve/page/${currentPage + 1}`;

  return (
    <Layout location={location}>
      <Helmet title={`Pensieve - Page ${currentPage}`} />

      <StyledMainContainer>
        <header>
          <h1 className="big-heading">Pensieve</h1>
          <p className="subtitle">
            <a href="https://www.wizardingworld.com/writing-by-jk-rowling/pensieve">
              a collection of memories
            </a>
          </p>
        </header>

        <StyledGrid>
          {posts.length > 0 &&
            posts.map((node, i) => {
              const { title, description, slug, date, tags } = node;
              const formattedDate = new Date(date).toLocaleDateString();
              let parsedTags = [];
              try {
                parsedTags = JSON.parse(tags || '[]');
              } catch (e) {
                if (typeof tags === 'string') parsedTags = tags.split(',').map(t => t.trim());
              }
              const isPrefixed = slug.startsWith('/pensieve/');
              const formattedSlug = isPrefixed ? slug : `/pensieve/${slug.replace(/^\//, '')}`;

              return (
                <StyledPost key={i}>
                  <div className="post__inner">
                    {node.cover && (
                      <div className="post__image">
                        <img src={node.cover} alt={title} />
                      </div>
                    )}

                    <div className="post__content">
                      <header>
                        <h5 className="post__title">
                          <Link to={formattedSlug}>{title}</Link>
                        </h5>
                        <p className="post__desc">{description}</p>
                        {node.content && (
                          <p className="post__excerpt">
                            {node.content.replace(/<[^>]+>/g, '').substring(0, 120)}...
                          </p>
                        )}
                      </header>

                      <div>
                        <Link to={formattedSlug} className="post__read-more">
                          Read More &rarr;
                        </Link>

                        <footer>
                          <span className="post__date">{formattedDate}</span>
                          <ul className="post__tags">
                            {parsedTags.map((tag, i) => (
                              <li key={i}>
                                <Link to={`/pensieve/tags/${kebabCase(tag)}/`} className="inline-link">
                                  #{tag}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </footer>
                      </div>
                    </div>
                  </div>
                </StyledPost>
              );
            })}
        </StyledGrid>

        {numPages > 1 && (
          <StyledPagination>
            <Link to={prevPage} className={isFirst ? 'disabled' : ''}>
              ← Previous
            </Link>
            <span>
              Page {currentPage} of {numPages}
            </span>
            <Link to={nextPage} className={isLast ? 'disabled' : ''}>
              Next →
            </Link>
          </StyledPagination>
        )}
      </StyledMainContainer>
    </Layout>
  );
};

PensieveList.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

export default PensieveList;

export const pageQuery = graphql`
  query pensieveListQuery($skip: Int!, $limit: Int!) {
    allDatabasePost(
      sort: { fields: [date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          title
          description
          slug
          date
          tags
          cover
          content
        }
      }
    }
  }
`;
