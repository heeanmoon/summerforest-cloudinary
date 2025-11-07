// pages/about.js
import Header from "../components/Header";

export default function About(){
  return (
    <div className="page">
      <Header/>
      <main className="container">
        <h1 style={{marginBottom:16}}>화원 花園 Hwawon</h1>

        <p>
          <strong><a href="#" target="_blank" rel="noreferrer">화원 花園 Hwawon</a></strong> is an imprint of
          {" "}<a href="#" target="_blank" rel="noreferrer">Mediabus</a>. Hwawon focuses on the performative aspect
          of design practice in which design methodology crystallizes into the structure and materiality of an object.
        </p>

        <hr/>

        <p>
          #501, 69 Saemunan-ro, Jongno-gu, Seoul, Republic of Korea 03175
          {" "}<a href="https://maps.google.com" target="_blank" rel="noreferrer">(map)</a>
        </p>
        <p>
          IG. {" "}
          <a href="https://instagram.com/hwawon_mediabus" target="_blank" rel="noreferrer">@hwawon_mediabus</a>
        </p>
        <p><a href="#" target="_blank" rel="noreferrer">Store</a></p>
        <p><a href="mailto:hwawon.mediabus@gmail.com">hwawon.mediabus@gmail.com</a></p>
      </main>

      <style jsx>{`
        .page{ background:#e5e5e5; }
        .container{ padding-top: 40px; padding-bottom: 120px; }
        p{ margin: 10px 0 14px; font-size: 22px; line-height: 1.45; }
        a{ color:#ff3b30; } /* 전역과 동일: 레드 링크 */
        hr{ border: none; border-bottom: 1.5px solid #000; margin: 26px 0; }
        @media (max-width:820px){ p{ font-size: 18px; } }
      `}</style>
    </div>
  );
}
