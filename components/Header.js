// components/Header.js
import Link from "next/link";
import { useRouter } from "next/router";

const NAV = [
  { label: "SUMMERFOREST", href: "/" },
  { label: "WORK", href: "/work" },
  { label: "ABOUT", href: "/about" },
  { label: "STUFF", href: "/summer" }, // 이것저것
];

export default function Header() {
  const { pathname } = useRouter();

  return (
    <>
      <header className="header">
        <nav className="menu">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
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
        <div className="underline" />
      </header>
      <div style={{ height: 62 }} />
      <style jsx>{`
        .header {
          position: fixed; inset: 0 0 auto 0; z-index: 1000;
          background: #e5e5e5; height: 62px; display: flex; flex-direction: column; justify-content: flex-end;
        }
        .menu {
          height: 100%; display: grid; grid-template-columns: repeat(4, 1fr); align-items: center; text-align: center;
          font-weight: 700; letter-spacing: .06em; font-size: 18px; color: #000; text-transform: uppercase;
        }
        .link { text-decoration: none; color: #000; opacity: .9; }
        .link:hover, .link.active { opacity: 1; }
        .underline { height: 2px; width: 100%; background: #000; }
        @media (max-width: 820px){ .menu{ font-size:14px; } }
      `}</style>
    </>
  );
}
