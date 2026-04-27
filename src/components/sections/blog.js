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
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
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
`;

import { posts as fallbackPosts } from '../../fallbackData';

const Blog = () => {
  const { data: postsList = fallbackPosts } = useQuery(['recent-posts'], async () => {
    const res = await api.get('/api/posts');
    const allPosts = res.data;
    // Filter out drafts and limit to 4
    return allPosts.filter(p => !p.draft).slice(0, 4);
  }, {
    initialData: fallbackPosts,
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
                  <header>
                    <div className="project-top">
                      <div className="folder">
                        <Icon name="Folder" />
                      </div>
                    </div>

                    <h3 className="project-title">
                      <Link to={formattedSlug}>{title}</Link>
                    </h3>

                    <div className="project-description">
                      <p>{description}</p>
                    </div>
                  </header>

                  <footer>
                    <ul className="project-tech-list">
                      {parsedTags.map((tag, i) => (
                        <li key={i}>{tag}</li>
                      ))}
                    </ul>
                  </footer>
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
