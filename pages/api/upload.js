// pages/api/upload.js
export default async function handler(req, res) {
  // ✅ CORS 헤더 (동일 출처에서도 OPTIONS가 올 수 있음)
  res.setHeader('Access-Control-Allow-Origin', '*'); // 필요시 도메인으로 제한
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ 프리플라이트(OPTIONS) 허용
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ↓↓↓ 기존 업로드 로직 (FormData -> Cloudinary 업로드) 그대로 유지 ↓↓↓
  try {
    // 예시: multipart/form-data 받기
    // const form = await unstable_parseMultipartFormData(req) ... 등
    // 또는 req.body에서 imageUrl 사용 등
    // Cloudinary 업로드 후 public URL 반환

    // 임시 예시 응답
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Upload failed' });
  }
}

