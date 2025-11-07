// components/Header.js
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * 메뉴 수정은 여기 NAV만 바꾸면 전 페이지에 반영됩니다.
 * href는 원하는 경로로 바꾸세요 (예: /work, /hwawon).
 */
const NAV = [
  { label: "SUMMERFOREST", href: "/" },
  { label: "WORK",         href: "/work" },
  { label: "ABOUTt",        href: "/about" },
  { label: "STUFF",      href: "/hwawon" }, // shin-shin.kr/hwawon 느낌
];

export default function Header() {
  const { pathname } = useRouter();

  return (
    <>
      <header className="site-header">
        <div className="inner">
          <Link href="/" className="brand">summerforest</Link>
          <nav className="nav">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`link ${active ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 고정 헤더 높이만큼 여백(헤더 뒤 콘텐츠 가리지 않도록) */}
      <div className="header-spacer" />

      <style jsx>{`
        .site-header {
          position: fixed; z-index: 1000;
          top: 0; left: 0; right: 0;
          height: 56px;
          /* 배경이 이미지/화이트 섞여도 보이도록 살짝 투명 + blur */
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(6px);
          /* 이미지 위에서도 흰색이 보이도록 글자 대비 보정 */
          mix-blend-mode: difference;
        }
        .inner {
          height: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .brand {
          color: #fff; text-decoration: none; font-weight: 800; letter-spacing: .04em;
        }
        .nav { display: flex; gap: 18px; }
        .link {
          color: #fff; text-decoration: none; font-weight: 600; letter-spacing: .04em;
          opacity: .9;
        }
        .link:hover { opacity: 1; text-decoration: underline; }
        .link.active { opacity: 1; text-decoration: underline; }

        .header-spacer { height: 56px; }
        @media (max-width: 820px) {
          .site-header { height: 52px; }
          .header-spacer { height: 52px; }
          .nav { gap: 14px; }
        }
      `}</style>
    </>
  );
}
