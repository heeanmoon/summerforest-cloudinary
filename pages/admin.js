// pages/admin.js
import { useEffect, useState } from 'react';

export default function Admin() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);

  // 폼 상태
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState(''); // URL 업로드용
  const [file, setFile] = useState(null);                  // 파일 업로드용
  const [isUploading, setIsUploading] = useState(false);

  // 로그인 토큰 유지
  useEffect(() => {
    const t = localStorage.getItem('sf_token');
    if (t) setToken(t);
    loadProjects();
  }, []);

  async function login(e) {
    e.preventDefault();
    const r = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const j = await r.json();
    if (r.ok && j.token) {
      localStorage.setItem('sf_token', j.token);
      setToken(j.token);
      alert('로그인 완료');
    } else {
      alert(j.error ?? '로그인 실패');
    }
  }

  async function loadProjects() {
    const r = await fetch('/api/projects');
    if (r.ok) {
      const j = await r.json();
      setProjects(j.projects ?? []);
    }
  }

  // 파일 → dataURL로 변환
  function fileToDataURL(f) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
  }

  // ① 이미지 업로드 (URL 또는 파일 둘 중 하나)
  async function handleUpload() {
    setIsUploading(true);
    try {
      let payload = {};
      if (file) {
        const dataUrl = await fileToDataURL(file); // 브라우저에서 base64로 변환
        payload.dataUrl = dataUrl;
      } else if (imageUrlInput.trim()) {
        payload.url = imageUrlInput.trim();
      } else {
        alert('파일을 선택하거나 이미지 URL을 입력하세요.');
        setIsUploading(false);
        return null;
      }

      const r = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // JSON으로 전송
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || '업로드 실패');

      // 업로드 성공 시 업로드된 URL 반환
      return j.url;
    } catch (e) {
      alert(e.message || '업로드 실패');
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  // ② 카드 추가
  async function addProject() {
    const uploadedUrl = await handleUpload();
    if (!uploadedUrl) return;

    const r = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        title,
        year,
        description,
        image: uploadedUrl,
      }),
    });
    const j = await r.json();
    if (!r.ok) {
      alert(j.error || '저장 실패');
      return;
    }

    // 폼 리셋 + 목록 갱신
    setTitle('');
    setYear('');
    setDescription('');
    setImageUrlInput('');
    setFile(null);
    await loadProjects();
    alert('저장 완료');
  }

  async function deleteProject(id) {
    if (!confirm('삭제할까요?')) return;
    const r = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    if (r.ok) {
      await loadProjects();
    } else {
      const j = await r.json().catch(() => ({}));
      alert(j.error || '삭제 실패');
    }
  }

  // ===== UI =====
  if (!token) {
    return (
      <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
        <h2>Admin Login</h2>
        <form onSubmit={login}>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }}
            required
          />
          <button type="submit" style={{ marginTop: 12 }}>로그인</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: 16 }}>
      <h2>Admin - Projects (Cloudinary)</h2>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
        <div style={{ marginBottom: 8 }}>이미지 업로드 (파일 또는 URL)</div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div style={{ margin: '8px 0', textAlign: 'center' }}>또는</div>
        <input
          type="text"
          placeholder="이미지 URL"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', height: 80, marginTop: 8 }}
        />

        <button onClick={addProject} disabled={isUploading} style={{ marginTop: 12 }}>
          {isUploading ? '업로드 중…' : 'Add'}
        </button>
        <button onClick={() => { setTitle(''); setYear(''); setDescription(''); setImageUrlInput(''); setFile(null); }} style={{ marginLeft: 8 }}>
          Reset
        </button>
      </div>

      <h3 style={{ marginTop: 24 }}>Projects</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        {projects.map((p) => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
            <div style={{ fontWeight: 600 }}>{p.title} ({p.year})</div>
            <div style={{ fontSize: 12, color: '#666' }}>{p.image}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => deleteProject(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
