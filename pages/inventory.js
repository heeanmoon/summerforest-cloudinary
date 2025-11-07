// pages/inventory.js
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";

/* 책 데이터: title, note, image(Cloudinary secure_url 권장) */
const ITEMS = [
  { title: "CHERRY",        note: "Artist Book, 2024", image: "https://res.cloudinary.com/demo/image/upload/w_1500/sample.jpg" },
  { title: "Untitled Blue", note: "Zine, 2023",        image: "https://res.cloudinary.com/demo/image/upload/w_1500/park.jpg"   },
  { title: "Folded Paper",  note: "Edition of 50",     image: "https://res.cloudinary.com/demo/image/upload/w_1500/beach.jpg"  },
];

export default function Inventory() {
  const [active, setActive] = useState(-1);
  const [xy, setXY] = useState({x:0, y:0});
  const [loaded, setLoaded] = useState(false);
  const imgUrl = useMemo(()=> (active>=0?ITEMS[active]?.image:""), [active]);

  useEffect(()=>{ const onMove=(e)=>setXY({x:e.clientX, y:e.clientY});
    window.addEventListener("mousemove", onMove);
    return ()=>window.removeEventListener("mousemove", onMove);
  },[]);

  useEffect(()=>{ setLoaded(false); if(!imgUrl) return;
    const img=new Image(); img.src=imgUrl; img.onload=()=>setLoaded(true);
  },[imgUrl]);

  const onItemClick = (i)=>{ if (window.innerWidth <= 820) setActive(prev => prev===i? -1 : i); };

  return (
    <div className="page">
      <Header/>

      <main className="wrap container">
        <ul className="list">
          {ITEMS.map((it,i)=>(
            <li key={i} className={`row ${active===i?"on":""}`}
                onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(-1)} onClick={()=>onItemClick(i)}>
              <span className="title">{it.title}</span>
              {it.note && <span className="note">{it.note}</span>}
            </li>
          ))}
        </ul>
      </main>

      <div className={`preview ${active>=0?"show":""} ${loaded?"ready":""}`}
           style={{ transform:`translate(${xy.x+16}px, ${xy.y+16}px)` }}>
        {imgUrl && <img src={imgUrl} alt="" draggable={false} />}
      </div>

      <style jsx>{`
        .page{ min-height:100%; background:#fff; color:#000; }
        .wrap{ min-height: calc(100vh - 56px); display:grid; place-items:center; }
        .list{ list-style:none; padding:0; margin: 40px 0 80px; width:min(880px,92vw); }
        .row{ display:flex; align-items:baseline; gap:16px; padding:14px 0; border-bottom:1px solid var(--border); }
        .row:first-child{ border-top:1px solid var(--border); }
        .title{ font-size: clamp(20px, 3.6vw, 40px); font-weight:700; letter-spacing: var(--ls-tight); opacity:.85; transition:opacity .2s; }
        .row:hover .title, .row.on .title{ opacity:1; }
        .note{ font-size: clamp(12px, 1.6vw, 14px); color:var(--muted); }

        .preview{ position:fixed; z-index:40; top:56px; left:0; width:42vw; max-width:600px; pointer-events:none;
                  opacity:0; transform-origin: top left; transition: opacity 160ms ease, transform 0s;
                  filter: drop-shadow(0 8px 18px rgba(0,0,0,.16)); }
        .preview img{ width:100%; height:auto; display:block; background:#eee; border-radius:6px; }
        .preview.show{ opacity:.0001; }
        .preview.show.ready{ opacity:1; }

        @media (max-width:820px){
          .preview{ width:92vw; left:50% !important; transform: translate(-50%, calc(100vh - 40vh)) !important; top:auto; }
        }
      `}</style>
    </div>
  );
}
