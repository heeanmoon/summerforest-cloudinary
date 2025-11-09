// pages/hwawon.js
import Header from "../components/Header";
export default function summer(){
  return (
    <div className="page">
      <Header/>
      <main className="container" style={{paddingTop:40}}>
        <h1>* (Stuff)</h1>
        <p className="muted">이것저것 모아두는 섹션. 필요하면 서브 메뉴/카드 레이아웃 추가.</p>
      </main>
      <style jsx>{`.page{ background:#e5e5e5; }`}</style>
    </div>
  );
}
