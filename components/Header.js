// components/Header.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/header.module.css";

const NAV = [
  { label: "SUMMERFOREST", href: "/" },
  { label: "BOOK", href: "/book" },
  { label: "ABOUT", href: "/about" },
  { label: "S", href: "/s" },
];

export default function Header() {
  const router = useRouter();

  return (
    <nav className={styles.bar} aria-label="Primary">
      <ul className={styles.grid}>
        {NAV.map((item) => {
          const active = router.pathname === item.href;
          return (
            <li key={item.href} className={styles.cell}>
              <Link
                href={item.href}
                className={`${styles.link} ${active ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
