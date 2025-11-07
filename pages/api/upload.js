// pages/api/upload.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// JSON 본문으로 Base64(dataURL)도 받을 수 있게 사이즈 상향
export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

export default async function handler(req, res) {
  // 프리플라이트 허용 (Safari가 종종 OPTIONS 쏨)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dataUrl, url } = req.body || {};
  if (!dataUrl && !url) {
    return res.status(400).json({ error: 'Provide dataUrl or url' });
  }

  try {
    const result = await cloudinary.uploader.upload(dataUrl || url, {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'summerforest',
    });
    return res.status(201).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Upload failed' });
  }
}
