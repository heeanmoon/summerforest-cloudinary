// pages/index.js
import { useEffect, useRef, useState } from "react";

/**
 * 여기에 네 이미지 URL들을 넣어줘.
 * 좌/우가 각각 독립적으로 순환돼서 shin-shin.kr 같은 느낌을 줌.
 */
const IMAGES_LEFT = [
  "https://res.cloudinary.com/demo/image/upload/w_2000/sample.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_2000/park.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_2000/city.jpg",
];

const IMAGES_RIGHT = [
  "https://res.cloudinary.com/demo/image/upload/w_2000/beach.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_2000/mountain.jpg",
  "https://res.cloudinary.com/demo/image/upload/w_2000/flower.jpg",
];

export default function Home() {
  const [li, setLi] = useState(0);
  const [ri, setRi] = useState(0);
  const [lLoaded, setLLoaded] = useState(false);
  const [rLoaded, setRLoaded] = useState(false);

  const leftUrl = IMAGES_LEFT[li % IMAGES_LEFT.length];
  const rightUrl = IMAGES_RIGHT[ri % IMAGES_RIGHT.length];

  // 프리로드(다음 컷 미리 로드)
  const preL = useRef({});
  const preR = useRef({});
  useEffect(() => {
    setLLoaded(false);
    const img = new Image();
    img.src = leftUrl;
    img.onload = () => setLLoaded(true);

    const next = (li + 1) % IMAGES_LEFT.length;
    if (!preL.current[next]) {
      const n = new Image();
      n.src = IMAGES_LEFT[next];
      preL.current[next] = true;
    }
  }, [li, leftUrl]);

  useEffect(() => {
    setRLoaded(false);
    const img = new Image();
    img.src = rightUrl;
    img.onload = () => setRLoaded(true);

    const next = (ri + 1) % IMAGES_RIGHT.length;
    if (!preR.current[next]) {
      const n = new Image();
      n.src = IMAGES_RIGHT[next];
      preR.current[next] = true;
    }
  }, [ri, rightUrl]);

  // 키보드 화살표: ← = 왼쪽 다음, → = 오른쪽 다음
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setLi((v) => (v + 1) % IMAGES_LEFT.length);
      if (e.key === "ArrowRight") setRi((v) => (v + 1) % IMAGES_RIGHT.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 터치 스와이프(간단): 왼쪽 패널 위 스와이프 → 왼쪽만, 오른쪽 패널 위 스와이프 → 오른쪽만
  const mkSwipeHandlers = (dir) => {
    let sx = 0, sy = 0, moved = false;
    const onStart = (e) => {
      const t = e.touches?.[0];
      sx = t?.clientX ?? 0;
      sy = t?.clientY ?? 0;
      moved = false;
    };
    const onMove = (e) => {
      moved = true;
    };
    const onEnd = (e) => {
      if (!moved) return; // 탭은 클릭으로 처리
      const t = e.changedTouches?.[0];
      const dx = (t?.clientX ?? 0) - sx;
      const dy = (t?.clientY ?? 0) - sy;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        if (dir === "left") setLi((v) => (v + 1) % IMAGES_LEFT.length);
        else setRi((v) => (v + 1) % IMAGES_RIGHT.length);
      }
    };
    return { onTouchStart: onStart, onTouchMove: onMove, onTouchEnd: onEnd };
  };

  return (
    <div className="page">
      {/* 상단 네비 – 원하면 라벨/링크 바꾸거나 삭제 가능 */}
      <header className="nav">
        <a className="brand" href="/">SHIN SHIN</a>
        <nav>
          <a href="/inventory">INVENTORY</a>
          <a href="/about">ABOUT</a>
        </nav>
      </header>

      {/* 좌/우 분할 히어로 */}
      <section className="split">
        {/* 왼쪽 패널 */}
        <div
          className="pane left"
          onClick={() => setLi((v) => (v + 1) % IMAGES_LEFT.length)}
          {...mkSwipeHandlers("left")}
        >
          <img
            key={leftUrl}
            src={leftUrl}
            alt=""
            className={`pic ${lLoaded ? "show" : ""}`}
            draggable={false}
          />
          <div className="hint">CLICK</div>
        </div>

        {/* 오른쪽 패널 */}
        <div
          className="pane right"
          onClick={() => setRi((v) => (v + 1) % IMAGES_RIGHT.length)}
          {...mkSwipeHandlers("right")}
        >
          <img
            key={rightUrl}
            src={rightUrl}
            alt=""
            className={`pic ${rLoaded ? "show" : ""}`}
            draggable={false}
          />
          <div className="hint">CLICK</div>
        </div>
      </section>

      <style jsx>{`
        :global(html, body, #__next) { height: 100%; }
        .page { min-height: 100%; background: #000; color: #fff; }

        .nav {
          position: fixed; z-index: 20; top: 0; left: 0; right: 0;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; mix-blend-mode: difference; pointer-events: none;
        }
        .nav a { pointer-events: all; color: #fff; text-decoration: none; font-weight: 600; letter-spacing: .04em; }
        .brand { font-weight: 800; }

        .split {
          position: fixed;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .pane {
          position: relative; overflow: hidden; cursor: pointer;
        }
        .pane:active { filter: brightness(0.95); }
        .left  { border-right: 1px solid rgba(255,255,255,.08); }
        .right { border-left:  1px solid rgba(255,255,255,.08); }

        .pic {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0;
          transform: scale(1.03);           /* 약간의 줌-인 페이드 */
          transition: opacity 420ms ease, transform 700ms ease;
          user-select: none;
        }
        .pic.show {
          opacity: 1;
          transform: scale(1);
        }

        .hint {
          position: absolute; bottom: 18px; right: 20px;
          font-size: 11px; letter-spacing: .14em; opacity: .6;
          background: rgba(0,0,0,.35); padding: 4px 8px; border-radius: 999px;
          backdrop-filter: blur(4px);
        }

        /* 모바일: 세로 스택(위/아래) */
        @media (max-width: 820px) {
          .split { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
          .left  { border-right: none; border-bottom: 1px solid rgba(255,255,255,.08); }
          .right { border-left:  none; border-top:    1px solid rgba(255,255,255,.08); }
        }
      `}</style>
    </div>
  );
}
