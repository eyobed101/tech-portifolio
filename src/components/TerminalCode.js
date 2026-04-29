import React from 'react';
import styled, { keyframes } from 'styled-components';

const codeUpwardAnimation = keyframes`
  0% { top: 110%; opacity: 0; }
  10% { opacity: var(--final-opacity); }
  80% { opacity: var(--final-opacity); }
  100% { top: -10%; opacity: 0; }
`;

const TerminalWrapper = styled.div`
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--green);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  user-select: none;
  pointer-events: none;

  .code-line {
    position: absolute;
    white-space: nowrap;
    animation: ${codeUpwardAnimation} linear infinite;
    animation-delay: var(--delay);
    animation-duration: var(--duration);
    animation-fill-mode: both;
    left: var(--left);
    font-weight: 500;
  }
`;

const codeLines = [
  'const profile = await api.get(\'/api/profile\');',
  'import { Security, Scalability } from \'dev\';',
  'function buildFuture() { return \'world-class\'; }',
  'git commit -m \'Release v5.0.0\'',
  'docker build -t tech-portfolio .',
  'kubectl apply -f deployment.yaml',
  'npm install @tanstack/react-query',
  'export default Hero;',
  '// Building secure digital experiences',
  'const isReady = true;',
  'sudo apt update && sudo apt upgrade',
  'ssh root@production-server',
  'grep -r \'security\' ./src',
  'chmod +x deploy.sh',
  'ping -c 4 eyobedelias.net.et',
  'systemctl restart nginx',
  'python3 -m venv venv',
  'source venv/bin/activate',
  'pip install djangorestframework',
  'aws s3 sync ./dist s3://my-bucket',
  'openssl genrsa -out key.pem 2048',
  'curl -X POST https://api.eyobed.me/v1/deploy',
  'ls -la /var/www/html',
  'tail -f /var/log/syslog',
  'netstat -tuln | grep 80',
  'iptables -A INPUT -p tcp --dport 22 -j ACCEPT',
  'df -h && free -m',
  'top -n 1 -b',
  'whoami && uptime',
  'history | tail -n 20',
  'cat /etc/passwd | cut -d: -f1',
  'ps aux --sort=-%mem | head -n 10',
];

const TerminalCode = () => (
  <TerminalWrapper>
    {[...Array(35)].map((_, i) => {
      const code = codeLines[Math.floor(Math.random() * codeLines.length)];
      // Depth layered setup: 1 (Front), 2 (Mid), 3 (Back)
      const depth = Math.floor(Math.random() * 3) + 1;

      let duration; let size; let opacity; let blur; let shadow; let zIndex;

      if (depth === 1) {
        // Front layer: Fast, big, bright, glow
        duration = 6 + Math.random() * 4;
        size = 14 + Math.random() * 4;
        opacity = 0.8 + Math.random() * 0.2;
        blur = 0;
        shadow = '0 0 8px rgba(0, 255, 100, 0.4)';
        zIndex = 3;
      } else if (depth === 2) {
        // Mid layer: Medium speed, normal size, semi-transparent
        duration = 10 + Math.random() * 5;
        size = 10 + Math.random() * 3;
        opacity = 0.4 + Math.random() * 0.3;
        blur = 0.8;
        shadow = 'none';
        zIndex = 2;
      } else {
        // Back layer: Slow, very small, faded, blurry ghosting
        duration = 16 + Math.random() * 8;
        size = 8 + Math.random() * 2;
        opacity = 0.15 + Math.random() * 0.2;
        blur = 1.8;
        shadow = 'none';
        zIndex = 1;
      }

      const delay = Math.random() * 20;
      const left = -5 + Math.random() * 75; // Spread horizontally, avoiding extreme right cutoff

      return (
        <div
          key={i}
          className="code-line"
          style={{
            '--delay': `${delay}s`,
            '--duration': `${duration}s`,
            '--left': `${left}%`,
            '--final-opacity': opacity,
            fontSize: `${size}px`,
            filter: `blur(${blur}px)`,
            textShadow: shadow,
            zIndex: zIndex,
          }}>
          {code}
        </div>
      );
    })}
  </TerminalWrapper>
);

export default TerminalCode;
