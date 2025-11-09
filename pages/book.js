// pages/book.js
import { useState } from "react";
import styles from "../styles/book.module.css";

/** 사용자가 준 ITEMS (오타 1개만 고침: hhttps → https) */
const ITEMS = [
  {
    title: "앞으로의 책방",
    author: "기타다 히로미쓰 / 문희언",
    year: 2017,
    summary: "앞으로의 책방을 위한 여러 제안들",
    thumb: "https://res.cloudinary.com/delrdongo/image/upload/v1762656583/x004_owkayu.jpg",
    images: ["https://res.cloudinary.com/delrdongo/image/upload/v1762656583/x004_owkayu.jpg"]
  },
  {
    title: "서점을 둘러싼 희망",
    author: "문희언",
    year: 2017,
    summary: "내일을 여는 지방의 진주문고 인터뷰",
    thumb: "https://res.cloudinary.com/delrdongo/image/upload/v1762656579/x001_cvjuzw.jpg",
    images: ["https://res.cloudinary.com/delrdongo/image/upload/v1762656579/x001_cvjuzw.jpg"]
  },
  {
    title: "후 이즈 힙스터? / 힙스터 핸드북",
    author: "문희언",
    year: 2017,
    summary: "“힙스터”에 관한 개인적인 견해들",
    thumb: "https://res.cloudinary.com/delrdongo/image/upload/v1762656588/x0007_kzuyfu.png",
    images: ["https://res.cloudinary.com/delrdongo/image/upload/v1762656588/x0007_kzuyfu.png"]
  },
  {
    title: "라디오헤드 OK COMPUTER",
    author: "권범준",
    year: 2018,
    summary: "영국 록밴드 라디오헤드에 대하여",
    thumb: "https://res.cloudinary.com/delrdongo/image/upload/v1762656580/x002_yvtomd.png",
    images: ["https://res.cloudinary.com/delrdongo/image/upload/v1762656580/x002_yvtomd.png"]
  },
  {
    title: "책 속의 유럽 아트북 페어",
    author: "홍주희",
    year: 2018,
    summary: "유럽의 아트북 페어와 참가자들",
    thumb: "https://res.cloudinary.com/delrdongo/image/upload/v1762656817/x005_henfpq.png",
    images: ["https://res.cloudinary.com/delrdongo/image/upload/v1762656817/x005_henfpq.png"]
  },
  {
    title: "컬러풀 오더 : 평양의 행복",
    author: "닉 오재",
    year: 2018,
    summary: "외국인만이 느낄수 있는 절반의 행복",
    thumb: "https://res.cloudinary.com/delrdongo/image/upload/v1762656589/x008_utpx1h.png",
    images: ["https://res.cloudinary.com/delrdongo/image/upload/v1762656589/x008_utpx1h.png"]
  },
  {
    title: "앞으로의 1인 출판사",
    author: "문희언",
    year: 2018,
    summary: "1인 출판사에 대하여",
    thumb: "https://res.cloudinary.com/delrdongo/image/upload/v1762656586/x006_um5l9a.png",
    images: ["https://res.cloudinary.com/delrdongo/image/upload/v1762656586/x006_um5l9a.png"]
  },
  {
    title: "도쿄산책",
    author: "문희언",
    year: 2024,
    summary: "남들이 가지 않은 도쿄를 찾아서",
    thumb: "https://res.cloudinary.com/delrdongo/image/upload/v1762656581/x003_my8gor.jpg",
    images: ["https://res.cloudinary.com/delrdongo/image/upload/v1762656581/x003_my8gor.jpg"]
  }
];

export default function Book() {
  const [hoverId, setHoverId] = useState(null);
  const [openId, setOpenId] = useState(null);

  return (
    <div className={styles.root}>
      {/* 상단 고정 네비(사이트 메뉴)와 겹치지 않도록 여백만 주고, 클릭 방해 X */}
      <div className={styles.spacer} />

      <div className={styles.listWrap}>
        {/* 테이블 헤더(BOOK / ABOUT / S) — 신신 스타일 */}
        <div className={styles.rowHead} aria-hidden>
          <div>BOOK</div>
          <div>ABOUT</div>
          <div className={styles.right}>S</div>
        </div>

        {ITEMS.map((it, idx) => {
          const open = openId === idx;
          const hover = hoverId === idx;

          return (
            <div
              key={it.title + idx}
              className={`${styles.row} ${hover ? styles.isHover : ""}`}
              onMouseEnter={() => setHoverId(idx)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => setOpenId(open ? null : idx)}
              role="button"
            >
              {/* 균등 정렬: 제목 / 저자 / 연도 */}
              <div className={styles.titleCell}>
                <span className={styles.titleText}>{it.title}</span>
              </div>
              <div className={styles.aboutCell}>{it.author}</div>
              <div className={styles.yearCell}>{it.year}</div>

              {/* 클릭 시 상세(중복 라벨 제거: 제목/지은이/연도는 다시 안 찍음) */}
              {open && (
                <div className={styles.detail}>
                  <div className={styles.detailBody}>{it.summary}</div>
                  <div className={styles.detailRight}>
                    {/* 원본 사이즈 그대로 */}
                    <img src={it.thumb} alt={it.title} />
                  </div>
                </div>
              )}

              {/* Hover 미리보기 — 우측 고정, 원본 사이즈, 클릭 막지 않음 */}
              {hover && !open && (
                <div className={styles.preview}>
                  <img src={it.thumb} alt={it.title} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
