import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import ThreeDTerminal from '../ThreeDTerminal';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
    margin-bottom: 70px;
  }
  
  .terminal-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

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

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What’s Next?</h2>

      <h2 className="title">Get In Touch</h2>

      <p>
        I’m always open to new opportunities and connections! Feel free to reach out—whether you
        have a question, a project in mind, or just want to say hello, I’ll do my best to respond
        promptly.
      </p>

      <a className="email-link" href={`mailto:${email}`}>
        Say Hello
      </a>

      <div className="terminal-wrapper">
        <ThreeDTerminal />
      </div>
    </StyledContactSection>
  );
};

export default Contact;
