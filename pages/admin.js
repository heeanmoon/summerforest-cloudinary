// pages/admin.js
import { useEffect, useState } from "react";

export default function AdminPage() {
  // 업로드/입력 상태
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [year, setYear] = useState("");

  // 목록
  const [loadingList, setLoadingList] = useState(false);
  const [list, setList] = useState([]);

  // ✅ 이미지 업로드
  const handleUpload = async () => {
    if (!file) return alert("이미지 파일을 선택하세요.");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (!res.ok || json.ok === false) throw new Error(json.error || "Upload failed");

      setUploadedUrl(json.url);
    } catch (e) {
      alert("업로드 실패: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ 프로젝트 저장 (year 포함)
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !uploadedUrl) return alert("제목과 이미지 업로드가 필요합니다.");

    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: desc,
          year,                 // ✅ ✅ year API로 전송!
          imageUrl: uploadedUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.ok === false) throw new Error(json.error || "Save failed");

      alert("저장 완료!");

      // 초기화
      setTitle("");
      setDesc("");
      setYear("");
      setUploadedUrl("");
      setFile(null);

      // 목록 갱신
      await loadList();
    } catch (e) {
      alert("저장 실패: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ 목록 로드
  const loadList = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      setList(json.items || []);
    } catch {
      setList([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Admin – Projects</h1>

      {/* ✅ 업로드 영역 */}
      <section style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>이미지 업로드</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          style={{ marginTop: 8 }}
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{ marginLeft: 8, padding: "8px 14px", borderRadius: 8 }}
        >
          {uploading ? "업로드 중..." : "Cloudinary로 업로드"}
        </button>

        {uploadedUrl && (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 6 }}>URL: {uploadedUrl}</div>
            <img
              src={uploadedUrl}
              alt="uploaded"
              style={{ maxWidth: "100%", marginTop: 10, borderRadius: 10 }}
            />
          </div>
        )}
      </section>

      {/* ✅ 프로젝트 입력 */}
      <section style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>새 프로젝트 추가</h2>

        <label style={{ display: "block", marginTop: 10 }}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />

        <label style={{ display: "block", marginTop: 10 }}>Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: 10 }}
        />

        <label style={{ display: "block", marginTop: 10 }}>Year</label>
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />

        <label style={{ display: "block", marginTop: 10 }}>최종 이미지 URL (자동)</label>
        <input
          value={uploadedUrl}
          readOnly
          style={{ width: "100%", padding: 10, background: "#f5f5f5" }}
        />

        <button
          onClick={handleSave}
          disabled={saving || !uploadedUrl || !title}
          style={{ marginTop: 14, padding: "10px 16px", borderRadius: 8 }}
        >
          {saving ? "저장 중..." : "Add"}
        </button>
      </section>

      {/* ✅ 목록 표시 */}
      <section style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Projects</h2>
          <button
            onClick={loadList}
            disabled={loadingList}
            style={{ padding: "6px 10px", borderRadius: 8 }}
          >
            {loadingList ? "Reloading..." : "Reload"}
          </button>
        </div>

        {list.length === 0 ? (
          <p style={{ marginTop: 12 }}>아직 항목이 없어요.</p>
        ) : (
          <div style={{ marginTop: 12, display: "grid", gap: 16 }}>
            {list.map((p) => (
              <div
                key={p.id}
                style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}
              >
                <div style={{ fontWeight: 700 }}>
                  {p.title} {p.year ? `(${p.year})` : ""}
                </div>
                <div style={{ color: "#666", marginTop: 4 }}>{p.description}</div>
                {p.image_url && (
                  <img
                    src={p.image_url}
                    style={{ maxWidth: "100%", marginTop: 8, borderRadius: 10 }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

