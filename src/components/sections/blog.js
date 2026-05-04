import React, { useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

const StyledBlogSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 15px;
    position: relative;
    margin-top: 50px;
    width: 100%;
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledPost = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);
  min-width: 300px;
  max-width: 350px;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    position: relative;
    height: 100%;
    padding: 0;
    border-radius: 16px;
    background-color: rgba(17, 34, 64, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(100, 255, 218, 0.1);
    transition: var(--transition);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &:hover {
      border: 1px solid rgba(100, 255, 218, 0.3);
      background-color: rgba(17, 34, 64, 0.6);
    }
  }

  .project-image {
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


  .project-title {
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

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-name {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.75;
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }

  .project-content {
    padding: 2rem 1.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .read-more {
    ${({ theme }) => theme.mixins.inlineLink};
    margin-top: 20px;
    font-size: var(--fz-sm);
    font-weight: 600;
    width: fit-content;
  }
`;

import { posts as fallbackPosts } from '../../fallbackData';

const Blog = () => {
  const { data: postsList = fallbackPosts } = useQuery(['recent-posts'], async () => {
    const res = await api.get('/api/posts');
    const allPosts = res.data;
    // Filter out drafts and limit to 4
    return allPosts.filter(p => !p.draft).slice(0, 4);
  });

  const posts = postsList;

  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealPosts = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealPosts.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <StyledBlogSection id="blog">
      <h2 ref={revealTitle}>Latest from my Blog</h2>
      <Link className="inline-link archive-link" to="/pensieve" ref={revealArchiveLink}>
        view the archive
      </Link>

      <ul className="projects-grid">
        {posts.length > 0 &&
          posts.map((node, i) => {
            const { title, description, slug, date, tags } = node;

            let parsedTags = [];
            try {
              parsedTags = JSON.parse(tags || '[]');
            } catch (e) {
              if (typeof tags === 'string') parsedTags = tags.split(',').map(t => t.trim());
            }

            const isPrefixed = slug.startsWith('/pensieve/');
            const formattedSlug = isPrefixed ? slug : '/pensieve/' + slug.replace(/^\//, '');

            return (
              <StyledPost key={i} ref={el => (revealPosts.current[i] = el)}>
                <div className="project-inner">
                  {node.cover && (
                    <div className="project-image">
                      <img src={node.cover} alt={title} />
                    </div>
                  )}

                  <div className="project-content">
                    <header>
                      <h3 className="project-title">
                        <Link to={formattedSlug}>{title}</Link>
                      </h3>

                      <div className="project-description">
                        <p>{description}</p>
                      </div>

                      {node.content && (
                        <p style={{
                          color: 'var(--slate)',
                          fontSize: 'var(--fz-sm)',
                          fontFamily: 'var(--font-mono)',
                          marginTop: '8px',
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {node.content.replace(/<[^>]+>/g, '').substring(0, 120)}...
                        </p>
                      )}
                    </header>

                    <div>
                      <Link to={formattedSlug} className="read-more">
                        Read More &rarr;
                      </Link>

                      <footer>
                        <ul className="project-tech-list">
                          {parsedTags.map((tag, i) => (
                            <li key={i}>{tag}</li>
                          ))}
                        </ul>
                      </footer>
                    </div>
                  </div>
                </div>
              </StyledPost>
            );
          })}
      </ul>
      <div className="more-button">
        <Link className="button" to="/pensieve">
          Read More
        </Link>
      </div>
    </StyledBlogSection>
  );
};

export default Blog;
