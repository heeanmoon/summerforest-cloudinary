// pages/about.js
import { useEffect, useMemo, useRef, useState } from "react";

const SECTIONS = [
  {
    id: "studio",
    title: "STUDIO",
    content: `
SHIN SHIN은 출판과 오브젝트, 전시를 넘나드는 스튜디오입니다.
사진, 그래픽, 인쇄라는 물질적 언어에 집중합니다.
서울을 기반으로 작업합니다.
    `,
  },
  {
    id: "practice",
    title: "PRACTICE",
    content: `
우리는 책을 설계하듯 이미지를 설계합니다.
결과물은 책, 포스터, 설치, 웹 등 여러 형태로 변환됩니다.
의뢰와 자체 프로젝트를 병행합니다.
    `,
  },
  {
    id: "exhibitions",
    title: "EXHIBITIONS",
    content: `
2024  •  'CHERRY' Solo, Seoul
2023  •  'Fold/Unfold' Group, Busan
2022  •  'Paper Works' Duo, Tokyo
    `,
  },
  {
    id: "contact",
    title: "CONTACT",
    content: `
Email  •  hello@shin-shin.kr
Instagram  •  @shinshin
Studio visit by appointment only.
    `,
  },
];

export default function About() {
  // 현재 화면에 가장 근접한 섹션 id
  const [active, setActive] = useState(SECTIONS[0].id);

  // 각 섹션 DOM ref 준비
  const refs = useMemo(
    () =>
      SECTIONS.reduce((acc, s) => {
        acc[s.id] = acc[s.id] || { el: null };
        return acc;
      }, {}),
    []
  );

  // 스크롤 감지(IntersectionObserver)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 화면 중앙 근처에 들어온 섹션을 active로
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const id = visible.target.getAttribute("data-id");
          if (id) setActive(id);
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px", // 중앙쯤에서 트리거
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    const nodes = Object.values(refs)
      .map((r) => r.el)
      .filter(Boolean);
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [refs]);

  // 목차 클릭 시 부드러운 스크롤
  const scrollTo = (id) => {
    const node = refs[id]?.el;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 20; // 약간의 여백
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="page">
      {/* 상단 네비 – 필요 시 수정/삭제 */}
      <header className="nav">
        <a className="brand" href="/">SHIN SHIN</a>
        <nav>
          <a href="/inventory">INVENTORY</a>
          <a href="/about" className="on">ABOUT</a>
        </nav>
      </header>

      {/* 본문 레이아웃: 좌측 목차(스티키) / 우측 내용 */}
      <div className="container">
        <aside className="toc">
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  className={`toc-item ${active === s.id ? "active" : ""}`}
                  onClick={() => scrollTo(s.id)}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="content">
          {SECTIONS.map((s) => (
            <section
              key={s.id}
              data-id={s.id}
              ref={(el) => (refs[s.id].el = el)}
              className="section"
            >
              <h2>{s.title}</h2>
              {s.content
                .trim()
                .split("\n")
                .map((line, i) => (
                  <p key={i}>{line.trim()}</p>
                ))}
            </section>
          ))}
        </main>
      </div>

      <style jsx>{`
        :global(html, body, #__next) { height: 100%; }
        .page { min-height: 100%; background: #fff; color: #000; }

        .nav {
          position: sticky; top: 0; z-index: 20;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; background: #fff;
          border-bottom: 1px solid rgba(0,0,0,.06);
        }
        .nav a { color: #000; text-decoration: none; font-weight: 600; letter-spacing: .04em; }
        .brand { font-weight: 800; }
        .nav a.on { text-decoration: underline; }

        .container {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 18px 120px;
        }

        /* 좌측 목차 */
        .toc {
          position: sticky;
          top: 68px;           /* 상단 네비 높이 + 여백 */
          height: max-content;
          align-self: start;
        }
        .toc ul { list-style: none; padding: 0; margin: 0; }
        .toc-item {
          all: unset;
          display: block; width: 100%;
          padding: 10px 6px;
          cursor: pointer; border-radius: 8px;
          font-weight: 700; letter-spacing: .02em;
          color: #111;
        }
        .toc-item:hover { background: rgba(0,0,0,.04); }
        .toc-item.active { background: #111; color: #fff; }

        /* 우측 콘텐츠 */
        .content { min-height: 70vh; }
        .section { padding: 28px 6px 44px; border-bottom: 1px solid rgba(0,0,0,.06); }
        .section:last-child { border-bottom: 0; padding-bottom: 80px; }
        .section h2 {
          font-size: clamp(18px, 2.4vw, 22px);
          letter-spacing: .08em;
          margin: 0 0 14px 0;
        }
        .section p {
          margin: 8px 0;
          line-height: 1.6;
          font-size: clamp(14px, 1.7vw, 16px);
        }

        /* 모바일 */
        @media (max-width: 820px) {
          .container { grid-template-columns: 1fr; }
          .toc { position: static; order: -1; }
          .toc-item { padding: 12px 8px; }
        }
      `}</style>
    </div>
  );
}
