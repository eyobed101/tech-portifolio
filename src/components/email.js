import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
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

const Email = ({ isHome }) => {
  const buildData = useStaticQuery(graphql`
    query {
      allDatabaseProfile {
        edges {
          node {
            email
          }
        }
      }
    }
  `);

  const initialEmail = buildData.allDatabaseProfile.edges[0]?.node?.email || 'eyobedeliast@gmail.com';

  const { data: profile } = useQuery(['profile'], async () => {
    const res = await api.get('/api/profile');
    return res.data;
  });

  const email = profile?.email || initialEmail;

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
