import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import ThreeDBackground from '../ThreeDBackground';

// ... (Styles remains same)

const StyledAboutSection = styled.section`
  max-width: 1000px;
  margin: 0 auto;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 60px;
    align-items: start; /* Changed to align items at top */

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  .about-content {
    p {
      margin-bottom: 1.5rem;
      line-height: 1.6;
      color: var(--light-slate);
    }

    a {
      ${({ theme }) => theme.mixins.link};
      font-weight: 500;
    }

    .highlight {
      color: var(--green);
      font-weight: 500;
    }
  }

  .skills-container {
    margin-top: 2rem;
  }

  .skills-group {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .skills-title {
    display: inline-block;
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    color: var(--green);
    margin-bottom: 1rem;
    padding-bottom: 5px;
    border-bottom: 2px solid var(--green-tint);
  }

  .skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 1fr));
    gap: 10px;
    padding: 0;
    margin: 0;
    list-style: none;
    overflow: hidden;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(140px, 1fr));
    }
  }

  .skill-item {
    position: relative;
    padding-left: 24px;
    margin-bottom: 12px;
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    color: var(--slate);
    transition: var(--transition);

    &:before {
      content: '▹';
      position: absolute;
      left: 0;
      color: var(--green);
      font-size: var(--fz-md);
      line-height: 1;
    }

    &:hover {
      color: var(--green);
      transform: translateX(5px);
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 320px;
  margin-left: auto;

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    margin: 40px auto 0;
    width: 70%;
  }

  @keyframes float {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(10px, 20px);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  .floating-object {
    position: absolute;
    background-color: var(--green-tint);
    border-radius: 50%;
    opacity: 0.7;
    animation: float 6s ease-in-out infinite;
    z-index: -1;
  }

  .floating-object:nth-child(1) {
    width: 50px;
    height: 50px;
    top: -10%;
    left: -10%;
    animation-delay: 0s;
  }

  .floating-object:nth-child(2) {
    width: 30px;
    height: 30px;
    top: 30%;
    right: -15%;
    animation-delay: 2s;
    animation-duration: 8s;
  }

  .floating-object:nth-child(3) {
    width: 40px;
    height: 40px;
    bottom: -5%;
    left: 20%;
    animation-delay: 4s;
    animation-duration: 7s;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    background-color: var(--green);
    transition: var(--transition);
    overflow: hidden;
    clip-path: circle(50% at 50% 50%);
    transition: all 0.5s ease-in-out;

    &:hover {
      transform: translate(-8px, -8px);
      box-shadow: 8px 8px 0 var(--green-tint);
      clip-path: ellipse(60% 40% at 50% 50%);

      .img {
        filter: none;
      }

      &:after {
        transform: translate(12px, 12px);
      }
    }

    .img {
      position: relative;
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition-long);
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid var(--green);
      top: 20px;
      left: 20px;
      z-index: -1;
      transition: var(--transition-long);
    }
  }
`;

import { profile as fallbackProfile } from '../../fallbackData';

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { data: profile = fallbackProfile } = useQuery(['profile'], async () => {
    const res = await api.get('/api/profile');
    return res.data;
  }, {
    initialData: fallbackProfile,
  });

  const aboutTitle = profile.aboutTitle || 'About Me';
  const aboutContent = profile.aboutContent || 'Hello! I am a developer who crafts digital experiences with purpose.';
  const aboutImage = profile.aboutImage;

  let skillCategories = [];
  if (typeof profile.aboutSkills === 'string') {
    try {
      skillCategories = JSON.parse(profile.aboutSkills || '[]');
    } catch (e) {
      console.error("Error parsing skills", e);
    }
  } else {
    skillCategories = profile.aboutSkills || [];
  }

  if (skillCategories.length === 0) {
    skillCategories = [
      {
        category: 'Technologies',
        items: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      }
    ];
  }

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <ThreeDBackground />
      <h2 className="numbered-heading">{aboutTitle}</h2>

      <div className="inner">
        <StyledText>
          <div className="about-content">
            {aboutContent.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                dangerouslySetInnerHTML={{
                  __html: paragraph
                    .replace(/national cybersecurity agency/g, '<a href="https://insa.gov.et/">national cybersecurity agency</a>')
                    .replace(/a start-up/g, '<a href="https://tripways.com.et/">a start-up</a>')
                    .replace(/a huge corporation/g, '<a href="https://www.apple.com/">a huge corporation</a>')
                    .replace(/a student-led design studio/g, '<a href="https://scout.camd.northeastern.edu/">a student-led design studio</a>')
                }}
              />
            ))}

            <p>Here are some technologies I work with:</p>
          </div>

          <div className="skills-container">
            {skillCategories.map((group, index) => (
              <div key={index} className="skills-group">
                <h4 className="skills-title">{group.category || group.title}</h4>
                <ul className="skills-list">
                  {group.items.map((skill, skillIndex) => (
                    <li key={skillIndex} className="skill-item">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </StyledText>

        <StyledPic>
          <span className="floating-object" />
          <span className="floating-object" />
          <span className="floating-object" />
          <div className="wrapper">
            {aboutImage ? (
              <img
                className="img"
                src={aboutImage}
                alt={aboutTitle}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            ) : (
              <StaticImage
                className="img"
                src="../../images/me.png"
                width={600}
                quality={100}
                formats={['WEBP', 'AVIF']}
                alt="Eyobed Elias - Full Stack Developer"
              />
            )}
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
