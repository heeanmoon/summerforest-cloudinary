// pages/inventory.js
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * 여기에 네 책 데이터를 넣어주세요.
 * image: 미리보기로 띄울 이미지(Cloudinary 등 절대경로 권장)
 * note  : 부제/간단 설명 (선택)
 */
const ITEMS = [
  {
    title: "CHERRY",
    note: "Artist Book, 2024",
    image: "https://res.cloudinary.com/demo/image/upload/w_1500/sample.jpg",
  },
  {
    title: "Untitled Blue",
    note: "Zine, 2023",
    image: "https://res.cloudinary.com/demo/image/upload/w_1500/park.jpg",
  },
  {
    title: "Folded Paper",
    note: "Edition of 50",
    image: "https://res.cloudinary.com/demo/image/upload/w_1500/beach.jpg",
  },
];

export default function Inventory() {
  const [active, setActive] = useState(-1);     // 현재 호버 중인 아이템 index
  const [xy, setXY] = useState({ x: 0, y: 0 }); // 커서 위치 (프리뷰 위치)
  const [loaded, setLoaded] = useState(false);  // 이미지 로딩 상태

  const imgUrl = useMemo(() => (active >= 0 ? ITEMS[active]?.image : ""), [active]);

  // 마우스 따라다니는 좌표
  useEffect(() => {
    const onMove = (e) => setXY({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // 프리로드
  useEffect(() => {
    setLoaded(false);
    if (!imgUrl) return;
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => setLoaded(true);
  }, [imgUrl]);

  // 모바일: 탭하면 활성화/해제
  const onItemClick = (i) => {
    if (window.innerWidth <= 820) {
      setActive((prev) => (prev === i ? -1 : i));
    }
  };

  return (
    <div className="page">
      <header className="nav">
        <a className="brand" href="/">SHIN SHIN</a>
        <nav>
          <a href="/inventory">INVENTORY</a>
          <a href="/about">ABOUT</a>
        </nav>
      </header>

      {/* 본문 영역: 가운데에 세로 리스트 */}
      <main className="wrap">
        <ul className="list">
          {ITEMS.map((it, i) => (
            <li
              key={i}
              className={`row ${active === i ? "on" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(-1)}
              onClick={() => onItemClick(i)}
            >
              <span className="title">{it.title}</span>
              {it.note && <span className="note">{it.note}</span>}
            </li>
          ))}
        </ul>
      </main>

      {/* 미리보기 이미지 (커서를 따라다님) */}
      <div
        className={`preview ${active >= 0 ? "show" : ""} ${loaded ? "ready" : ""}`}
        style={{
          transform: `translate(${xy.x + 16}px, ${xy.y + 16}px)`,
        }}
      >
        {imgUrl && <img src={imgUrl} alt="" draggable={false} />}
      </div>

      <style jsx>{`
        :global(html, body, #__next) { height: 100%; }
        .page { min-height: 100%; background: #fff; color: #000; }

        .nav {
          position: fixed; z-index: 30; top: 0; left: 0; right: 0;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; mix-blend-mode: difference; pointer-events: none;
        }
        .nav a { pointer-events: all; color: #fff; text-decoration: none; font-weight: 600; letter-spacing: .04em; }
        .brand { font-weight: 800; }

        .wrap {
          position: relative;
          display: grid; place-items: center;
          min-height: 100vh;
        }

        .list {
          list-style: none; padding: 0; margin: 0;
          width: min(880px, 92vw);
        }

        .row {
          display: flex; align-items: baseline; gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(0,0,0,.08);
          cursor: default;
        }
        .row:first-child { border-top: 1px solid rgba(0,0,0,.08); }
        .row.on .title { opacity: 1; letter-spacing: 0.02em; }
        .row:hover .title { opacity: 1; }

        .title {
          font-size: clamp(20px, 3.6vw, 40px);
          font-weight: 700;
          opacity: .85;
          transition: opacity 200ms ease, letter-spacing 200ms ease;
          white-space: nowrap;
        }
        .note {
          font-size: clamp(12px, 1.6vw, 14px);
          opacity: .6;
        }

        /* 프리뷰: 기본은 숨김, 커서를 살짝 따라옴 */
        .preview {
          position: fixed; z-index: 40; top: 0; left: 0;
          width: 42vw; max-width: 600px;
          pointer-events: none;
          opacity: 0; transform-origin: top left; transition: opacity 160ms ease, transform 0s;
          will-change: transform, opacity;
          filter: drop-shadow(0 8px 18px rgba(0,0,0,.16));
        }
        .preview img {
          width: 100%; height: auto; display: block;
          background: #eee; border-radius: 6px;
        }
        .preview.show { opacity: .0001; } /* 로딩 전엔 거의 보이지 않게 */
        .preview.show.ready { opacity: 1; } /* 로딩 후 선명하게 */
        
        /* 모바일: 커서 없음 → 화면 하단 고정 미리보기로 전환 */
        @media (max-width: 820px) {
          .preview {
            width: 92vw; left: 50% !important;
            transform: translate(-50%, calc(100vh - 40vh)) !important;
          }
        }
      `}</style>
    </div>
  );
}
