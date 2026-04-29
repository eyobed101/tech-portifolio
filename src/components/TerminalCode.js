import React from 'react';
import styled, { keyframes } from 'styled-components';

const codeUpwardAnimation = keyframes`
  0% { transform: translateY(100vh); opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { transform: translateY(-100vh); opacity: 0; }
`;

const TerminalWrapper = styled.div`
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--green);
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  user-select: none;
  pointer-events: none;

  .code-line {
    position: absolute;
    white-space: nowrap;
    animation: ${codeUpwardAnimation} linear infinite;
    animation-delay: var(--delay);
    animation-duration: var(--duration);
    left: var(--left);
    font-weight: 500;
  }
`;

const codeLines = [
  "const profile = await api.get('/api/profile');",
  "import { Security, Scalability } from 'dev';",
  "function buildFuture() { return 'world-class'; }",
  "git commit -m 'Release v5.0.0'",
  "docker build -t tech-portfolio .",
  "kubectl apply -f deployment.yaml",
  "npm install @tanstack/react-query",
  "export default Hero;",
  "// Building secure digital experiences",
  "const isReady = true;",
  "sudo apt update && sudo apt upgrade",
  "ssh root@production-server",
  "grep -r 'security' ./src",
  "chmod +x deploy.sh",
  "ping -c 4 eyobedelias.net.et",
  "systemctl restart nginx",
  "python3 -m venv venv",
  "source venv/bin/activate",
  "pip install djangorestframework",
  "aws s3 sync ./dist s3://my-bucket",
  "openssl genrsa -out key.pem 2048",
  "curl -X POST https://api.eyobed.me/v1/deploy",
  "ls -la /var/www/html",
  "tail -f /var/log/syslog",
  "netstat -tuln | grep 80",
  "iptables -A INPUT -p tcp --dport 22 -j ACCEPT",
  "df -h && free -m",
  "top -n 1 -b",
  "whoami && uptime",
  "history | tail -n 20",
  "cat /etc/passwd | cut -d: -f1",
  "ps aux --sort=-%mem | head -n 10",
];

const TerminalCode = () => (
  <TerminalWrapper>
    {[...Array(60)].map((_, i) => {
      const code = codeLines[Math.floor(Math.random() * codeLines.length)];
      const delay = Math.random() * 15;
      const duration = 6 + Math.random() * 6;
      const left = Math.random() * 95;

      return (
        <div
          key={i}
          className="code-line"
          style={{
            '--delay': `${delay}s`,
            '--duration': `${duration}s`,
            '--left': `${left}%`,
            top: '100%',
            fontSize: `${Math.random() * 6 + 10}px`,
            opacity: Math.random() * 0.4 + 0.3,
          }}
        >
          {code}
        </div>
      );
    })}
  </TerminalWrapper>
);

export default TerminalCode;
