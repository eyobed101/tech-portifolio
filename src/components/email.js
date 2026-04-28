import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Side } from '@components';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

const StyledLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background-color: var(--light-slate);
  }

  a {
    margin: 20px auto;
    padding: 10px;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: var(--fz-lg);
    letter-spacing: 0.1em;
    writing-mode: vertical-rl;

    &:hover,
    &:focus {
      transform: translateY(-3px);
    }
  }
`;

import { profile as fallbackProfile } from '../fallbackData';

const Email = ({ isHome }) => {
  const { data: profile = fallbackProfile } = useQuery(['profile'], async () => {
    const res = await api.get('/api/profile');
    return res.data;
  });

  const email = profile?.email || fallbackProfile.email;

  return (
    <Side isHome={isHome} orientation="right">
      <StyledLinkWrapper>
        <a href={`mailto:${email}`}>{email}</a>
      </StyledLinkWrapper>
    </Side>
  );
};

Email.propTypes = {
  isHome: PropTypes.bool,
};

export default Email;
