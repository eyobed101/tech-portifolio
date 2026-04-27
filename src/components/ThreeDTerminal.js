import React from 'react';
import styled, { keyframes } from 'styled-components';

const floatAnimation = keyframes`
  0% { transform: translateY(0px) perspective(1000px) rotateY(-20deg) rotateX(10deg) translateZ(0px); box-shadow: -20px 20px 40px -15px var(--navy-shadow); }
  50% { transform: translateY(-15px) perspective(1000px) rotateY(-16deg) rotateX(12deg) translateZ(10px); box-shadow: -25px 25px 50px -15px var(--navy-shadow); }
  100% { transform: translateY(0px) perspective(1000px) rotateY(-20deg) rotateX(10deg) translateZ(0px); box-shadow: -20px 20px 40px -15px var(--navy-shadow); }
`;

const TerminalContainer = styled.div`
  width: 320px;
  background-color: #0b1120;
  border-radius: 8px;
  border: 1px solid var(--lightest-navy);
  padding: 20px;
  z-index: 10;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  transform-style: preserve-3d;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    display: none;
  }

  .mac-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    span {
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #ff5f56;
      &:nth-child(2) { background-color: #ffbd2e; }
      &:nth-child(3) { background-color: #27c93f; }
    }
  }

  .code {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--light-slate);
    line-height: 1.8;

    .keyword { color: #c678dd; }
    .function { color: #61afef; }
    .string { color: #98c379; }
    .comment { color: #5c6370; font-style: italic; }
  }
`;

const ThreeDTerminal = ({ style }) => {
    return (
        <TerminalContainer style={style}>
            <div className="mac-buttons">
                <span />
                <span />
                <span />
            </div>
            <div className="code">
                <span className="comment">// Execution environment</span><br />
                <span className="keyword">const</span> env <span className="keyword">=</span> {'{'}<br />
                &nbsp;&nbsp;type: <span className="string">'Production'</span>,<br />
                &nbsp;&nbsp;focus: [<span className="string">'Performance'</span>, <span className="string">'Stability'</span>],<br />
                &nbsp;&nbsp;<span className="function">execute</span>: () <span className="keyword">=&gt;</span> <span className="string">"Success"</span><br />
                {'}'};<br />
                <br />
                <span className="function">env.execute</span>();
            </div>
        </TerminalContainer>
    );
};

export default ThreeDTerminal;
