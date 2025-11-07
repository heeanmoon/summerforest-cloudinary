// pages/api/projects.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { title, description, image_url } = req.body || {};

    if (!title || !image_url) {
      return res.status(400).json({ ok: false, error: 'Missing fields' });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{ title, description: description || '', image_url }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(201).json({ ok: true, project: data });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
