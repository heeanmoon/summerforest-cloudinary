// pages/work.js
import Head from "next/head";
import Link from "next/link";

const ITEMS = [
  {
    title: "후 이즈 힙스터/ 힙스터 핸드북",
    credit: "문희언 | 여름의숲 | 2017년",
    img: "https://res.cloudinary.com/delrdongo/image/upload/v1762582569/024_u54gax.jpg",
  },
  {
    title: "앞으로의 책방",
    credit: "기타다 히로미쓰, 문희언 | 여름의숲 | 2017년",
    // ⚠️ 이 주소는 .jpg.jpg 로 끝남 → 404 나면 .jpg 하나만 남겨서 쓰기
    img: "https://res.cloudinary.com/delrdongo/image/upload/v1762582567/020_sjiyzp.jpg",
  },
  {
    title: "책 속의 유럽 아트북 페어",
    credit: "홍주희 | 여름의숲 | 2018년",
    img: "https://res.cloudinary.com/delrdongo/image/upload/v1762582568/021_lmzqm9.jpg",
  },
  {
    title: "라디오헤드 OK Computer 1992~2017 라디오헤드 앨범 가이드",
    credit: "권범준 | 여름의숲 | 2018년",
    img: "https://res.cloudinary.com/delrdongo/image/upload/v1762582568/023_oujia2.jpg",
  },
];

export default function Work() {
  return (
    <>
      <Head>
        <title>Work · Summerforest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="wrap">
        {/* 상단 헤더가 별도 컴포넌트라면 <Header/>로 교체해도 됩니다 */}
        <header className="topbar">
          <Link href="/" className="brand">summerforest</Link>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/work" className="active">Work</Link>
          </nav>
        </header>

        <section className="grid">
          {ITEMS.map((it, i) => (
            <article key={i} className="card">
              <div className="thumb">
                <img src={it.img} alt={it.title} loading="lazy" />
              </div>
              <h3 className="title">{it.title}</h3>
              <p className="credit">{it.credit}</p>
            </article>
          ))}
        </section>
      </main>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          background: #f5f6f7;
        }
        .topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          background: #ffffffcc;
          backdrop-filter: saturate(180%) blur(10px);
          border-bottom: 1px solid #eaeaea;
        }
        .brand {
          font-weight: 700;
          letter-spacing: 0.02em;
          text-decoration: none;
          color: #111;
        }
        .nav :global(a) {
          margin-left: 14px;
          text-decoration: none;
          color: #555;
        }
        .nav :global(a.active) {
          color: #111;
          font-weight: 600;
        }

        .grid {
          padding: 28px 20px 60px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }
        @media (max-width: 1200px) {
          .grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 820px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .grid { grid-template-columns: 1fr; }
        }

        .card {
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
        }
        .thumb {
          aspect-ratio: 4/3;
          background: #eef1f3;
          overflow: hidden;
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.02);
          transition: transform .6s ease;
        }
        .card:hover .thumb img {
          transform: scale(1.06);
        }
        .title {
          font-size: 16px;
          line-height: 1.3;
          margin: 12px 14px 4px;
          color: #111;
        }
        .credit {
          margin: 0 14px 14px;
          color: #666;
          font-size: 13px;
        }
      `}</style>
    </>
  );
}
