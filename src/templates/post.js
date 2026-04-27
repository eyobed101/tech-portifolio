import React from 'react';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import { Icon } from '@components/icons';

const StyledPostContainer = styled.main`
  max-width: 1000px;
`;
const StyledPostHeader = styled.header`
  margin-bottom: 50px;
  .tag {
    margin-right: 10px;
  }
`;
const StyledPostContent = styled.div`
  margin-bottom: 100px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2em 0 1em;
  }

  p {
    margin: 1em 0;
    line-height: 1.5;
    color: var(--light-slate);
  }

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  code {
    background-color: var(--lightest-navy);
    color: var(--lightest-slate);
    border-radius: var(--border-radius);
    font-size: var(--fz-sm);
    padding: 0.2em 0.4em;
  }

  pre code {
    background-color: transparent;
    padding: 0;
  }
`;

const StyledShare = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px dashed var(--lightest-navy);

  span {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    color: var(--light-slate);
    margin-right: 20px;
  }

  .share-links {
    display: flex;
    align-items: center;
    gap: 15px;

    a,
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      background-color: var(--light-navy);
      border-radius: 50%;
      color: var(--light-slate);
      transition: var(--transition);
      border: none;
      cursor: pointer;

      &:hover,
      &.copied {
        background-color: var(--green-tint);
        color: var(--green);
        transform: translateY(-3px);
      }

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

const PostTemplate = ({ data, location }) => {
  const { title, date, tags, content, description, cover } = data.databasePost;
  let tagsList = [];
  try {
    tagsList = JSON.parse(tags);
  } catch (e) {
    if (typeof tags === 'string') tagsList = tags.split(',').map(t => t.trim());
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(title)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout location={location}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        {cover && <meta property="og:image" content={cover} />}
        {cover && <meta name="twitter:image" content={cover} />}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <StyledPostContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/pensieve">All memories</Link>
        </span>

        <StyledPostHeader>
          <h1 className="medium-heading">{title}</h1>
          <p className="subtitle">
            <time>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>&nbsp;&mdash;&nbsp;</span>
            {tagsList &&
              tagsList.length > 0 &&
              tagsList.map((tag, i) => (
                <Link key={i} to={`/pensieve/tags/${kebabCase(tag)}/`} className="tag">
                  #{tag}
                </Link>
              ))}
          </p>
        </StyledPostHeader>

        <StyledPostContent dangerouslySetInnerHTML={{ __html: content }} />

        <StyledShare>
          <span>Share this post:</span>
          <div className="share-links">
            <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
              <Icon name="Twitter" />
            </a>
            <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
              <Icon name="Linkedin" />
            </a>
            <button onClick={handleCopy} aria-label="Copy Link" className={copied ? 'copied' : ''} title="Copy link">
              <Icon name={copied ? "Bookmark" : "External"} />
            </button>
          </div>
        </StyledShare>
      </StyledPostContainer>
    </Layout>
  );
};

export default PostTemplate;

PostTemplate.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
};

export const pageQuery = graphql`
  query($slug: String!) {
    databasePost(slug: { eq: $slug }) {
      title
      description
      date
      slug
      tags
      content
      cover
    }
  }
`;
