// pages/index.js
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";

/* 좌/우 이미지 배열만 네 Cloudinary URL로 바꿔줘 */
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

  const leftUrl  = IMAGES_LEFT[ li % IMAGES_LEFT.length ];
  const rightUrl = IMAGES_RIGHT[ ri % IMAGES_RIGHT.length ];

  const preL = useRef({}), preR = useRef({});

  useEffect(() => {
    setLLoaded(false);
    const img = new Image();
    img.src = leftUrl; img.onload = () => setLLoaded(true);
    const nx = (li + 1) % IMAGES_LEFT.length;
    if (!preL.current[nx]) { const n = new Image(); n.src = IMAGES_LEFT[nx]; preL.current[nx] = true; }
  }, [li, leftUrl]);

  useEffect(() => {
    setRLoaded(false);
    const img = new Image();
    img.src = rightUrl; img.onload = () => setRLoaded(true);
    const nx = (ri + 1) % IMAGES_RIGHT.length;
    if (!preR.current[nx]) { const n = new Image(); n.src = IMAGES_RIGHT[nx]; preR.current[nx] = true; }
  }, [ri, rightUrl]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  setLi(v => v + 1);
      if (e.key === "ArrowRight") setRi(v => v + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const mkSwipeHandlers = (side) => {
    let sx=0, sy=0, moved=false;
    return {
      onTouchStart: (e)=>{ const t=e.touches?.[0]; sx=t?.clientX??0; sy=t?.clientY??0; moved=false; },
      onTouchMove: ()=>{ moved=true; },
      onTouchEnd: (e)=>{ if(!moved) return; const t=e.changedTouches?.[0];
        const dx=(t?.clientX??0)-sx, dy=(t?.clientY??0)-sy;
        if (Math.abs(dx)>Math.abs(dy) && Math.abs(dx)>30) side==="left"?setLi(v=>v+1):setRi(v=>v+1);
      }
    };
  };

  return (
    <div className="page">
      <Header/>

      <section className="split">
        <div className="pane left"  onClick={()=>setLi(v=>v+1)} {...mkSwipeHandlers("left")}>
          <img key={leftUrl}  src={leftUrl}  alt="" className={`pic ${lLoaded?"show":""}`} draggable={false}/>
        </div>
        <div className="pane right" onClick={()=>setRi(v=>v+1)} {...mkSwipeHandlers("right")}>
          <img key={rightUrl} src={rightUrl} alt="" className={`pic ${rLoaded?"show":""}`} draggable={false}/>
        </div>
      </section>

      <style jsx>{`
        :global(.site-header){ mix-blend-mode: difference; } /* 이미지 위에서도 깔끔한 흰색 */
        .page{ min-height:100%; background:#000; color:#fff; }
        .split{ position:fixed; inset:56px 0 0 0; display:grid; grid-template-columns:1fr 1fr; }
        .pane{ position:relative; overflow:hidden; cursor:pointer; }
        .left{  border-right:1px solid rgba(255,255,255,.08); }
        .right{ border-left: 1px solid rgba(255,255,255,.08); }
        .pic{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
              opacity:0; transform:scale(1.03); transition:opacity 420ms ease, transform 700ms ease; user-select:none; }
        .pic.show{ opacity:1; transform:scale(1); }
        @media (max-width:820px){
          .split{ grid-template-columns:1fr; grid-template-rows:1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
