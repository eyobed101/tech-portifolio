import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 15px;
  text-align: center;
`;

const StyledSocialLinks = styled.div`
  display: block;
  width: 100%;
  max-width: 270px;
  margin: 0 auto 10px;
  color: var(--light-slate);

  .get-in-touch {
    margin-bottom: 20px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--green);
  }

  ul {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledCredit = styled.div`
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 1;

  a {
    padding: 10px;
  }

  .github-stats {
    margin-top: 10px;

    & > span {
      display: inline-flex;
      align-items: center;
      margin: 0 7px;
    }
    svg {
      display: inline-block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
    }
  }
`;

import { profile as fallbackProfile } from '../fallbackData';

const Footer = () => {
  const [githubInfo, setGitHubInfo] = useState({
    stars: null,
    forks: null,
  });

  const { data: profile = fallbackProfile } = useQuery(['profile'], async () => {
    const res = await api.get('/api/profile');
    return res.data;
  });
  const socialMedia = [
    { name: 'GitHub', url: profile.github },
    { name: 'Linkedin', url: profile.linkedin },
    { name: 'Twitter', url: profile.twitter },
    { name: 'Instagram', url: profile.instagram },
    { name: 'Codepen', url: profile.codepen },
    { name: 'Email', url: `mailto:${profile.email || fallbackProfile.email}` },
  ].filter(s => s.url);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    fetch('https://api.github.com/repos/eyobed101/v4')
      .then(response => response.json())
      .then(json => {
        const { stargazers_count, forks_count } = json;
        setGitHubInfo({
          stars: stargazers_count,
          forks: forks_count,
        });
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <StyledFooter>
      <StyledSocialLinks>
        <div className="get-in-touch">Get In Touch</div>
        <ul>
          {socialMedia &&
            socialMedia.map(({ name, url }, i) => (
              <li key={i}>
                <a href={url} aria-label={name}>
                  <Icon name={name} />
                </a>
              </li>
            ))}
        </ul>
      </StyledSocialLinks>

      <StyledCredit tabIndex="-1">
        <a href="https://github.com/eyobed101/v4">
          <div>Designed &amp; Built by Eyobed Elias</div>

          {githubInfo.stars > 0 || githubInfo.forks > 0 ? (
            <div className="github-stats">
              <span>
                <Icon name="Star" />
                <span>{githubInfo.stars.toLocaleString()}</span>
              </span>
              <span>
                <Icon name="Fork" />
                <span>{githubInfo.forks.toLocaleString()}</span>
              </span>
            </div>
          ) : null}
        </a>
      </StyledCredit>
    </StyledFooter>
  );
};

Footer.propTypes = {
  githubInfo: PropTypes.object,
};

export default Footer;
