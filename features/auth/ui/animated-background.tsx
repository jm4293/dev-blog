'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Matrix 스타일 코드 레인 생성
    const createMatrixRain = () => {
      const codeSnippets = [
        'const dev = () => {}',
        'function build()',
        'async await',
        'import React',
        'export default',
        'console.log()',
        'npm install',
        'git commit',
        '=> { }',
        'useState()',
        'useEffect()',
        'TypeScript',
        'JavaScript',
        '<Component />',
        '{ props }',
        'return (',
        'interface {}',
        'type Props =',
        'class App',
        'extends React',
      ];

      const columnCount = Math.floor(window.innerWidth / 80);

      for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'absolute top-0 font-mono text-sm pointer-events-none';
        column.style.left = `${i * 80 + Math.random() * 40}px`;

        const snippetCount = Math.floor(Math.random() * 3) + 2;
        const columnText = Array.from(
          { length: snippetCount },
          () => codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        ).join('\n');

        column.textContent = columnText;
        column.style.color = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.4})`;

        gsap.set(column, {
          y: -200 - Math.random() * 500,
          opacity: 0,
        });

        container.appendChild(column);

        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * 8;

        gsap.to(column, {
          y: window.innerHeight + 200,
          opacity: [0, 0.9, 0.6, 0] as any,
          duration,
          delay,
          repeat: -1,
          ease: 'none',
        });
      }
    };

    // 터미널 커서 효과
    const createTerminalCursors = () => {
      const count = 5;

      for (let i = 0; i < count; i++) {
        const cursor = document.createElement('div');
        cursor.className = 'absolute w-2 h-4 bg-green-400 pointer-events-none';
        cursor.style.boxShadow = '0 0 15px rgba(74, 222, 128, 0.8)';

        const startX = Math.random() * (window.innerWidth - 100);
        const startY = Math.random() * (window.innerHeight - 100);

        gsap.set(cursor, {
          x: startX,
          y: startY,
          opacity: 0,
        });

        container.appendChild(cursor);

        // 깜빡이는 커서 효과
        gsap.to(cursor, {
          opacity: [0, 0.8, 0] as any,
          duration: 1.5,
          repeat: -1,
          ease: 'power1.inOut',
          delay: Math.random() * 2,
        });

        // 이동 애니메이션
        gsap.to(cursor, {
          x: `+=${Math.random() * 200 - 100}`,
          y: `+=${Math.random() * 200 - 100}`,
          duration: 8 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    };

    // 네트워크 노드 연결 효과
    const createNetworkNodes = () => {
      const nodeCount = 30;
      const nodes: Array<{ x: number; y: number; element: HTMLDivElement }> = [];

      for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'absolute w-2 h-2 rounded-full bg-blue-400/70 pointer-events-none';
        node.style.boxShadow = '0 0 8px rgba(59, 130, 246, 0.5)';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        gsap.set(node, { x, y });
        container.appendChild(node);
        nodes.push({ x, y, element: node });

        // 노드 움직임
        gsap.to(node, {
          x: `+=${(Math.random() - 0.5) * 300}`,
          y: `+=${(Math.random() - 0.5) * 300}`,
          duration: 20 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // 노드 간 연결선 그리기
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'absolute inset-0 pointer-events-none');
      svg.style.width = '100%';
      svg.style.height = '100%';
      container.appendChild(svg);

      const updateLines = () => {
        svg.innerHTML = '';
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
              const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              line.setAttribute(
                'x1',
                nodes[i].element.style.transform.match(/translateX\((.+?)px/)?.[1] || nodes[i].x.toString(),
              );
              line.setAttribute(
                'y1',
                nodes[i].element.style.transform.match(/translateY\((.+?)px/)?.[1] || nodes[i].y.toString(),
              );
              line.setAttribute(
                'x2',
                nodes[j].element.style.transform.match(/translateX\((.+?)px/)?.[1] || nodes[j].x.toString(),
              );
              line.setAttribute(
                'y2',
                nodes[j].element.style.transform.match(/translateY\((.+?)px/)?.[1] || nodes[j].y.toString(),
              );
              line.setAttribute('stroke', `rgba(59, 130, 246, ${0.3 * (1 - distance / 200)})`);
              line.setAttribute('stroke-width', '1.5');
              svg.appendChild(line);
            }
          }
        }
      };

      gsap.ticker.add(updateLines);
    };

    // 바이너리 데이터 스트림
    const createBinaryStream = () => {
      const streamCount = 15;

      for (let i = 0; i < streamCount; i++) {
        const stream = document.createElement('div');
        stream.className = 'absolute font-mono text-xs leading-tight pointer-events-none';

        const binaryString = Array.from({ length: 20 }, () => (Math.random() > 0.5 ? '1' : '0')).join('');

        stream.textContent = binaryString;
        stream.style.color = `rgba(34, 197, 94, ${Math.random() * 0.4 + 0.3})`;

        const startX = Math.random() * window.innerWidth;
        const isHorizontal = Math.random() > 0.5;

        if (isHorizontal) {
          gsap.set(stream, {
            x: -200,
            y: Math.random() * window.innerHeight,
            rotation: 0,
          });

          container.appendChild(stream);

          gsap.to(stream, {
            x: window.innerWidth + 200,
            duration: 10 + Math.random() * 10,
            repeat: -1,
            delay: Math.random() * 5,
            ease: 'none',
          });
        } else {
          gsap.set(stream, {
            x: startX,
            y: -200,
            rotation: 90,
          });

          container.appendChild(stream);

          gsap.to(stream, {
            y: window.innerHeight + 200,
            duration: 10 + Math.random() * 10,
            repeat: -1,
            delay: Math.random() * 5,
            ease: 'none',
          });
        }
      }
    };

    // Git 커밋 로그 스타일 요소
    const createCommitLogs = () => {
      const commitMessages = [
        'feat: add new feature',
        'fix: resolve bug',
        'docs: update README',
        'refactor: clean code',
        'style: format code',
        'test: add tests',
        'chore: update deps',
        'perf: optimize',
      ];

      const count = 6;

      for (let i = 0; i < count; i++) {
        const log = document.createElement('div');
        log.className =
          'absolute font-mono text-xs bg-gray-800/50 border border-blue-400/40 rounded px-2 py-1 pointer-events-none whitespace-nowrap';
        log.textContent = commitMessages[Math.floor(Math.random() * commitMessages.length)];
        log.style.color = 'rgba(147, 197, 253, 0.7)';

        const startX = Math.random() * (window.innerWidth - 200);
        const startY = Math.random() * (window.innerHeight - 50);

        gsap.set(log, { x: startX, y: startY, opacity: 0 });
        container.appendChild(log);

        gsap.to(log, {
          x: `+=${(Math.random() - 0.5) * 100}`,
          y: `+=${(Math.random() - 0.5) * 100}`,
          opacity: [0, 0.7, 0.7, 0] as any,
          duration: 12 + Math.random() * 8,
          repeat: -1,
          ease: 'power1.inOut',
          delay: Math.random() * 5,
        });
      }
    };

    createMatrixRain();
    createTerminalCursors();
    createNetworkNodes();
    createBinaryStream();
    createCommitLogs();

    // 클린업 함수
    return () => {
      gsap.killTweensOf('*');
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-900"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.03) 0%, transparent 50%)
        `,
      }}
    />
  );
};
