// pages/api/upload.js
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

export const config = {
  api: { bodyParser: false }, // multipart/form-data 직접 파싱
};

// Cloudinary 설정 (환경변수는 Vercel에 이미 넣어둠)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function parseForm(req) {
  const form = formidable({ multiples: false, keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    // 1) multipart 업로드(파일) 시도
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      const { files } = await parseForm(req);
      const file = files?.file || files?.image || Object.values(files || {})[0];
      if (!file?.filepath) {
        return res.status(400).json({ ok: false, error: 'No file found' });
      }

      const uploadRes = await cloudinary.uploader.upload(file.filepath, {
        folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'summerforest',
        resource_type: 'image',
      });

      return res.status(200).json({ ok: true, url: uploadRes.secure_url });
    }

    // 2) JSON으로 image_url 전송한 경우(원격 URL 업로드)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    const remoteUrl = body.image_url || body.imageUrl;

    if (!remoteUrl) {
      return res.status(400).json({ ok: false, error: 'No image_url' });
    }

    const uploadRes = await cloudinary.uploader.upload(remoteUrl, {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'summerforest',
      resource_type: 'image',
    });

    return res.status(200).json({ ok: true, url: uploadRes.secure_url });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
