import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Side } from '@components';
import { Icon } from '@components/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

const StyledSocialList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background-color: var(--light-slate);
  }

  li {
    &:last-of-type {
      margin-bottom: 20px;
    }

    a {
      padding: 10px;

      &:hover,
      &:focus {
        transform: translateY(-3px);
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

import { profile as fallbackProfile } from '../fallbackData';

const Social = ({ isHome }) => {
  const { data: profile = fallbackProfile } = useQuery(['profile'], async () => {
    const res = await api.get('/api/profile');
    return res.data;
  }, {
    initialData: fallbackProfile,
  });
  const socialMedia = [
    { name: 'GitHub', url: profile.github },
    { name: 'Linkedin', url: profile.linkedin },
    { name: 'Twitter', url: profile.twitter },
    { name: 'Instagram', url: profile.instagram },
    { name: 'Codepen', url: profile.codepen },
  ].filter(s => s.url);

  return (
    <Side isHome={isHome} orientation="left">
      <StyledSocialList>
        {socialMedia &&
          socialMedia.map(({ url, name }, i) => (
            <li key={i}>
              <a href={url} aria-label={name} target="_blank" rel="noreferrer">
                <Icon name={name} />
              </a>
            </li>
          ))}
      </StyledSocialList>
    </Side>
  );
};

Social.propTypes = {
  isHome: PropTypes.bool,
};

export default Social;
