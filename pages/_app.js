import "../styles/globals.css";      // 전역(폰트/변수)
import Header from "../components/Header";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      {/* 헤더 높이만큼 아래로 밀기 */}
      <div style={{ height: "var(--header-h)" }} />
      <Component {...pageProps} />
    </>
  );
}
