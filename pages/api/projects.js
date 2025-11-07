// pages/api/projects.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, description, year, imageUrl } = req.body || {};
    if (!title || !imageUrl) {
      return res.status(400).json({ ok: false, error: "title, imageUrl required" });
    }

    const row = {
      title,
      description: description || "",
      year: year || null,         // ✅ year 포함!
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("projects").insert(row).select().single();
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(201).json({ ok: true, project: data });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("projects")
      .select("id,title,description,year,image_url,created_at")  // ✅ year 포함
      .order("id", { ascending: false });

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, items: data || [] });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ ok: false, error: "Method Not Allowed" });
}

