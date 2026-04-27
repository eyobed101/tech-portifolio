import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import anime from 'animejs';

// New continuous wave animation for text
const waveAnimation = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translateY(-5px) rotate(2deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(5px) rotate(-2deg);
  }
`;

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h2,
  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  .big-heading {
    font-size: clamp(40px, 8vw, 80px);
    margin: 0;
    font-weight: 600;
    color: var(--lightest-slate);
  }
  .big-heading-two {
    font-size: clamp(20px, 5vw, 60px);
    margin: 0;
    font-weight: 600;
    color: var(--green);
  }

  .wave-text {
    display: inline-block;
  }

  .wave-char {
    display: inline-block;
    animation: ${waveAnimation} 3s ease-in-out infinite;
    animation-delay: calc(var(--char-index) * 0.1s);
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }

  .fadeup-enter {
    opacity: 0.01;
    transform: translateY(20px);
    transition: opacity 300ms var(--easing), transform 300ms var(--easing);
  }

  .fadeup-enter-active {
    opacity: 1;
    transform: translateY(0px);
  }

  .char {
    display: inline-block;
    opacity: 0;
  }

  .space {
    display: inline-block;
    width: 0.1em;
  }
`;

const typewriterAnimation = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const cursorAnimation = keyframes`
  0% { border-right-color: rgba(255, 255, 255, 0.75); }
  100% { border-right-color: transparent; }
`;

const LoopingTypewriter = styled.h3`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid rgba(255, 255, 255, 0.75);
  letter-spacing: 0.05em;
  animation: ${typewriterAnimation} 4s steps(40) 1s forwards,
    ${cursorAnimation} 750ms steps(40) infinite;

  &.reset {
    animation: none;
  }
`;

const WaveText = ({ text, className, as: Component = 'h3' }) => {
  const textRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      if (textRef.current) {
        textRef.current.textContent = text;
      }
      return;
    }

    const element = textRef.current;
    if (!element) {
      return;
    }

    element.innerHTML = '';

    text.split('').forEach((char, index) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'wave-char';
      charSpan.style.setProperty('--char-index', index);
      charSpan.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(charSpan);
    });

    // Add continuous pulsing effect
    anime({
      targets: element.querySelectorAll('.wave-char'),
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      duration: 3000,
      delay: anime.stagger(100),
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
    });
  }, [text, prefersReducedMotion]);

  return <Component ref={textRef} className={`${className} wave-text`} />;
};

WaveText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  as: PropTypes.string,
};
const AnimatedText = ({ text, className, as: Component = 'h2' }) => {
  const textRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      if (textRef.current) {
        textRef.current.textContent = text;
      }
      return;
    }

    const element = textRef.current;
    if (!element) {
      return;
    }

    element.innerHTML = '';
    const wordsAndSpaces = text.split(/(\s+)/);

    wordsAndSpaces.forEach((segment, segmentIndex) => {
      if (segment === ' ') {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'space';
        spaceSpan.innerHTML = '&nbsp;';
        element.appendChild(spaceSpan);
      } else if (segment.trim() !== '') {
        segment.split('').forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.className = 'char';
          charSpan.textContent = char;
          element.appendChild(charSpan);
        });

        if (segmentIndex < wordsAndSpaces.length - 1 && wordsAndSpaces[segmentIndex + 1] === ' ') {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'space';
          spaceSpan.innerHTML = '&nbsp;';
          element.appendChild(spaceSpan);
        }
      }
    });

    anime
      .timeline({ loop: false })
      .add({
        targets: element.querySelectorAll('.char'),
        opacity: [0, 1],
        translateX: [20, 0],
        duration: 800,
        delay: (el, i) => 50 * i,
        easing: 'easeOutExpo',
      })
      .add({
        targets: element.querySelectorAll('.space'),
        opacity: [0, 1],
        duration: 200,
        easing: 'linear',
        offset: '-=600',
      });
  }, [text, prefersReducedMotion]);

  return <Component ref={textRef} className={className} />;
};

AnimatedText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  as: PropTypes.string,
};

const TypewriterComponent = ({ text, className, as: Component = 'h3' }) => {
  const [key, setKey] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      // Force React to re-render and restart the animation
      setKey(prevKey => prevKey + 1);
    }, 6000); // Restart every 6s (duration + pause)

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <LoopingTypewriter
      as={Component}
      key={key} // changes to trigger animation reset
      className={className}>
      {text}
    </LoopingTypewriter>
  );
};

TypewriterComponent.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  as: PropTypes.string,
};

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const data = useStaticQuery(graphql`
    query {
      allDatabaseProfile {
        edges {
          node {
            name
            intro
            description
          }
        }
      }
    }
  `);

  const profile = data.allDatabaseProfile.edges[0]?.node || {
    name: 'Eyobed Elias.',
    intro: 'I build secure digital experiences.',
    description: "I'm a software developer and CTO specializing in building secure, scalable systems across multiple platforms.",
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1 className="animated-heading">Hi, my name is</h1>;
  const two = <AnimatedText text={profile.name || 'Eyobed Elias.'} className="big-heading" as="h2" />;

  const intro = profile.intro || 'I build secure digital experiences.';
  const introParts = intro.split(/(?=experiences\.)/);
  const threeText = introParts[0] || 'I build secure digital';
  const fourText = introParts[1] || 'experiences.';

  const three = (
    <TypewriterComponent text={threeText} className="big-heading-two" as="h3" />
  );
  const four = <AnimatedText text={fourText} className="big-heading-two" as="h3" />;

  const description = profile.description || 'Software Developer and Technical Lead specializing in building secure, scalable systems.';
  const five = (
    <p
      dangerouslySetInnerHTML={{
        __html: description
          .replace(/Tripways/g, '<a href="https://tripways.com.et/" target="_blank" rel="noreferrer">Tripways</a>')
          .replace(/INSA/g, '<a href="https://insa.gov.et/" target="_blank" rel="noreferrer">INSA</a>')
      }}
    />
  );

  const six = (
    <a className="email-link" href="mailto:eyobedeliast@gmail.com" target="_blank" rel="noreferrer">
      Get In Touch
    </a>
  );

  const items = [one, two, three, four, five, six];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay} appear>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
