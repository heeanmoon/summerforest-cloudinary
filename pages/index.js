// pages/index.js
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";

/* 여기에 네 Cloudinary 이미지 URL로 교체 */
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
  const [li, setLi] = useState(0), [ri, setRi] = useState(0);
  const [lOk, setLOk] = useState(false), [rOk, setROk] = useState(false);
  const left = IMAGES_LEFT[li % IMAGES_LEFT.length];
  const right = IMAGES_RIGHT[ri % IMAGES_RIGHT.length];

  const preL = useRef({}), preR = useRef({});
  useEffect(()=>{ setLOk(false); const i=new Image(); i.src=left; i.onload=()=>setLOk(true);
    const nx=(li+1)%IMAGES_LEFT.length; if(!preL.current[nx]){ const n=new Image(); n.src=IMAGES_LEFT[nx]; preL.current[nx]=true; }
  },[li,left]);
  useEffect(()=>{ setROk(false); const i=new Image(); i.src=right; i.onload=()=>setROk(true);
    const nx=(ri+1)%IMAGES_RIGHT.length; if(!preR.current[nx]){ const n=new Image(); n.src=IMAGES_RIGHT[nx]; preR.current[nx]=true; }
  },[ri,right]);

  const swipe = (side)=>{
    let sx=0, sy=0, moved=false;
    return {
      onTouchStart:(e)=>{ const t=e.touches?.[0]; sx=t?.clientX??0; sy=t?.clientY??0; moved=false; },
      onTouchMove:()=>{ moved=true; },
      onTouchEnd:(e)=>{ if(!moved) return; const t=e.changedTouches?.[0]; const dx=(t?.clientX??0)-sx; const dy=(t?.clientY??0)-sy;
        if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>30){ side==="L"?setLi(v=>v+1):setRi(v=>v+1); } },
    };
  };

  return (
    <div className="page">
      <Header/>
      <section className="split">
        <div className="pane" onClick={()=>setLi(v=>v+1)} {...swipe("L")}>
          <img key={left} src={left} alt="" className={`pic ${lOk?"show":""}`} draggable={false}/>
        </div>
        <div className="pane" onClick={()=>setRi(v=>v+1)} {...swipe("R")}>
          <img key={right} src={right} alt="" className={`pic ${rOk?"show":""}`} draggable={false}/>
        </div>
      </section>
      <style jsx>{`
        .page{ background:#e5e5e5; }
        .split{ position:fixed; inset:62px 0 0 0; display:grid; grid-template-columns:1fr 1fr; }
        .pane{ position:relative; overflow:hidden; cursor:pointer; }
        .pic{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
              opacity:0; transform:scale(1.03); transition:opacity .42s ease, transform .7s ease; user-select:none; }
        .pic.show{ opacity:1; transform:scale(1); }
        @media (max-width:820px){ .split{ grid-template-columns:1fr; grid-template-rows:1fr 1fr; } }
      `}</style>
    </div>
  );
}
