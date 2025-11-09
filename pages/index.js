// /pages/index.js
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------------------------
   이미지 URL (절대경로만)
---------------------------- */
const IMAGES_LEFT = [
  "https://res.cloudinary.com/delrdongo/image/upload/v1762582566/010_bhxego.jpg",
  "https://res.cloudinary.com/delrdongo/image/upload/v1762582565/009_cphedj.jpg",
  "https://res.cloudinary.com/delrdongo/image/upload/v1762613251/015_ge1sdq.jpg",
  "https://res.cloudinary.com/delrdongo/image/upload/v1762582562/001_znmw9m.jpg",
  "https://res.cloudinary.com/delrdongo/image/upload/v1762613250/014_wqshkd.jpg",
];

const IMAGES_RIGHT = [
  "https://res.cloudinary.com/delrdongo/image/upload/v1762582563/002_gg54ai.jpg",
  "https://res.cloudinary.com/delrdongo/image/upload/v1762582564/005_plavg1.jpg",
  "https://res.cloudinary.com/delrdongo/image/upload/v1762613083/013_srhmux.jpg",
  "https://res.cloudinary.com/delrdongo/image/upload/v1762582564/004_ygpzzj.jpg",
  "https://res.cloudinary.com/delrdongo/image/upload/v1762582930/011_xo0tb2.jpg",
];

export default function Home() {
  /* 1) 인덱스 전용 클래스(헤더 처리용) */
  useEffect(() => {
    document.documentElement.classList.add("hero-index");
    return () => document.documentElement.classList.remove("hero-index");
  }, []);

  /* 2) 슬라이더 로직 */
  const [li, setLi] = useState(0);
  const [ri, setRi] = useState(0);
  const badLeft = useRef(new Set());
  const badRight = useRef(new Set());

  const left = useMemo(
    () => IMAGES_LEFT.filter((u) => !!u && !badLeft.current.has(u)),
    [li]
  );
  const right = useMemo(
    () => IMAGES_RIGHT.filter((u) => !!u && !badRight.current.has(u)),
    [ri]
  );

  const lLen = left.length;
  const rLen = right.length;

  useEffect(() => {
    const preload = (url) => { if (!url) return; const img = new Image(); img.src = url; };
    preload(lLen ? left[(li + 1) % lLen] : undefined);
    preload(rLen ? right[(ri + 1) % rLen] : undefined);
  }, [li, ri, lLen, rLen, left, right]);

  const onErrorLeft = () => { if (!lLen) return; badLeft.current.add(left[li % lLen]); setLi(v => (v + 1) % Math.max(1, lLen)); };
  const onErrorRight = () => { if (!rLen) return; badRight.current.add(right[ri % rLen]); setRi(v => (v + 1) % Math.max(1, rLen)); };

  const nextLeft = () => lLen && setLi(v => (v + 1) % lLen);
  const nextRight = () => rLen && setRi(v => (v + 1) % rLen);

  const makeSwipeHandlers = (goNext) => {
    const t = { x: 0, y: 0, moved: false };
    return {
      onTouchStart: (e) => { const p = e.touches?.[0]; t.x = p?.clientX ?? 0; t.y = p?.clientY ?? 0; t.moved = false; },
      onTouchMove: () => { t.moved = true; },
      onTouchEnd: (e) => {
        if (!t.moved) return;
        const p = e.changedTouches?.[0];
        const dx = (p?.clientX ?? 0) - t.x;
        const dy = (p?.clientY ?? 0) - t.y;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 24) goNext();
      },
    };
  };

  const lSwipe = useMemo(() => makeSwipeHandlers(nextLeft), [lLen]);
  const rSwipe = useMemo(() => makeSwipeHandlers(nextRight), [rLen]);

  /* 3) JSX */
  return (
    <>
      {/* ✅ 메뉴는 클릭되게 유지하면서 ‘사진이 위에 얹힌 느낌’만 주는 오버레이 */}
      <div className="menuMask" aria-hidden="true" />

      <main className="split">
        <div className="pane left" onClick={nextLeft} {...lSwipe}>
          {lLen ? (
            <img
              key={left[li % lLen]}
              src={left[li % lLen]}
              alt=""
              className="pic"
              draggable="false"
              onError={onErrorLeft}
            />
          ) : <div className="empty">Add LEFT image URLs (https://...)</div>}
        </div>

        <div className="pane right" onClick={nextRight} {...rSwipe}>
          {rLen ? (
            <img
              key={right[ri % rLen]}
              src={right[ri % rLen]}
              alt=""
              className="pic"
              draggable="false"
              onError={onErrorRight}
            />
          ) : <div className="empty">Add RIGHT image URLs (https://...)</div>}
        </div>
      </main>

      <style jsx>{`
        :root { --header-h: 48px; --menu-overlay-strength: 0.85; } 
        /* ↑ overlay 강도: 1 = 효과 없음, 0.7 = 조금 진하게 */

        .split{
          position: fixed;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          z-index: 0; /* 헤더 아래(우리는 마스크로 연출) */
          background: #efefef;
        }
        .pane{ position:relative; overflow:hidden; cursor:pointer; user-select:none; touch-action:pan-y; }
        .pic{
          position:absolute; inset:0;
          width:100%; height:100%;
          object-fit:cover; object-position:center;
          -webkit-user-drag:none;
        }
        .empty{ display:flex; align-items:center; justify-content:center; color:#999; }

        /* ── 핵심: 클릭은 통과시키고, 시각적으로만 '덮인 듯' 연출 */
        .menuMask{
          position: fixed;
          top:0; left:0; right:0;
          height: var(--header-h);
          z-index: 1100;          /* 헤더(1000)보다 위 */
          pointer-events: none;   /* 클릭은 헤더로 통과 */
          background: transparent;
          -webkit-backdrop-filter: brightness(var(--menu-overlay-strength));
          backdrop-filter: brightness(var(--menu-overlay-strength));
        }

        @media (max-width: 820px){
          .split{ grid-template-columns:1fr 1fr; }
        }
      `}</style>
    </>
  );
}
