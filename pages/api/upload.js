// pages/api/upload.js
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

// 🔴 Next.js가 기본 bodyParser로 멀티파트를 못 읽으니 반드시 끔
export const config = {
  api: { bodyParser: false },
};

// Cloudinary 설정 (환경변수 필요)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // 1) 멀티파트 파싱 (form-data)
    const form = formidable({
      multiples: false,
      maxFileSize: 20 * 1024 * 1024, // 20MB
      keepExtensions: true,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files.file; // 프론트에서 form.append("file", file)
    if (!file) {
      return res.status(400).json({ ok: false, error: "No file provided" });
    }

    const filepath = Array.isArray(file) ? file[0].filepath : file.filepath;
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "uploads";

    // 2) Cloudinary 업로드 (파일 경로로 업로드)
    const result = await cloudinary.uploader.upload(filepath, {
      folder,
      resource_type: "image",
    });

    // 3) 성공 응답
    return res.status(200).json({
      ok: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res
      .status(err?.http_code || 500)
      .json({ ok: false, error: err?.message || "Upload failed" });
  }
}


