// pages/work.js
import Header from "../components/Header";
export default function Work(){
  return (
    <div className="page">
      <Header/>
      <main className="container" style={{paddingTop:40}}>
        <h1>WORK</h1>
        <p className="muted">작업 목록/그리드를 이후에 채워 넣습니다.</p>
      </main>
      <style jsx>{`.page{ background:#e5e5e5; }`}</style>
    </div>
  );
}
