// pages/about.js
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";

const SECTIONS = [
  { id:"studio",      title:"STUDIO",      content:`SHIN SHIN은 출판과 오브젝트, 전시를 넘나드는 스튜디오입니다.\n사진, 그래픽, 인쇄라는 물질적 언어에 집중합니다.\n서울을 기반으로 작업합니다.` },
  { id:"practice",    title:"PRACTICE",    content:`우리는 책을 설계하듯 이미지를 설계합니다.\n결과물은 책, 포스터, 설치, 웹 등 여러 형태로 변환됩니다.\n의뢰와 자체 프로젝트를 병행합니다.` },
  { id:"exhibitions", title:"EXHIBITIONS", content:`2024 • 'CHERRY' Solo, Seoul\n2023 • 'Fold/Unfold' Group, Busan\n2022 • 'Paper Works' Duo, Tokyo` },
  { id:"contact",     title:"CONTACT",     content:`Email • hello@summerforest\nInstagram • @summerforest\nStudio visit by appointment only.` },
];

export default function About(){
  const [active,setActive]=useState(SECTIONS[0].id);
  const refs = useMemo(()=> SECTIONS.reduce((a,s)=> (a[s.id]={el:null},a),{}),[]);

  useEffect(()=>{
    const io = new IntersectionObserver((ents)=>{
      const vis = ents.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (vis){ const id = vis.target.getAttribute("data-id"); if (id) setActive(id); }
    },{ root:null, rootMargin:"-35% 0px -55% 0px", threshold:[0.1,0.25,0.5,0.75,1]});
    Object.values(refs).forEach(r=> r.el && io.observe(r.el));
    return ()=> io.disconnect();
  },[refs]);

  const scrollTo = (id)=>{
    const n = refs[id]?.el; if(!n) return;
    const top = n.getBoundingClientRect().top + window.scrollY - 16;
    window.scrollTo({ top, behavior:"smooth" });
  };

  return (
    <div className="page">
      <Header/>

      <div className="container">
        <aside className="toc">
          <ul>
            {SECTIONS.map(s=>(
              <li key={s.id}>
                <button className={`toc-item ${active===s.id?"active":""}`} onClick={()=>scrollTo(s.id)}>{s.title}</button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="content">
          {SECTIONS.map(s=>(
            <section key={s.id} data-id={s.id} ref={(el)=> (refs[s.id].el=el)} className="section">
              <h2>{s.title}</h2>
              {s.content.trim().split("\n").map((line,i)=>(<p key={i}>{line.trim()}</p>))}
            </section>
          ))}
        </main>
      </div>

      <style jsx>{`
        .page{ min-height:100%; background:#fff; color:#000; }
        .container{ display:grid; grid-template-columns:260px 1fr; gap:24px; max-width:1100px; margin:0 auto; padding:24px 18px 120px; }
        .toc{ position:sticky; top:72px; height:max-content; align-self:start; }
        .toc ul{ list-style:none; padding:0; margin:0; }
        .toc-item{ all:unset; display:block; width:100%; padding:10px 6px; cursor:pointer; border-radius:8px;
                   font-weight:700; letter-spacing: var(--ls-tight); color:#111; }
        .toc-item:hover{ background: rgba(0,0,0,.04); }
        .toc-item.active{ background:#111; color:#fff; }
        .content{ min-height:70vh; }
        .section{ padding:28px 6px 44px; border-bottom:1px solid var(--border); }
        .section:last-child{ border-bottom:0; padding-bottom:80px; }
        .section h2{ font-size: clamp(18px, 2.4vw, 22px); letter-spacing:.08em; margin:0 0 14px 0; }
        .section p{ margin:8px 0; line-height: var(--lh-body); font-size: clamp(14px, 1.7vw, 16px); color:#111; }
        @media (max-width:820px){
          .container{ grid-template-columns:1fr; }
          .toc{ position: static; }
        }
      `}</style>
    </div>
  );
}
