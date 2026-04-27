import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  position: relative;
  z-index: 10;
  color: var(--lightest-slate);
  transition: var(--transition);

  &:hover,
  &:focus {
    color: var(--green);
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const IconSun = () => (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const IconMoon = () => (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark');

    // Check localStorage and system preference on initial load
    useEffect(() => {
        const savedTheme = window.localStorage.getItem('theme');
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersLight) {
            setTheme('light');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        window.localStorage.setItem('theme', newTheme);
    };

    return (
        <ToggleButton onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </ToggleButton>
    );
};

export default ThemeToggle;
