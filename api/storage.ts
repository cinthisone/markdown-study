import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const STORAGE_KEY = 'zip-md-data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // Save files
    const { files, lastUploaded } = req.body;
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'Missing files array' });
    }
    await kv.set(STORAGE_KEY, { files, lastUploaded });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    // Get files
    const data = await kv.get(STORAGE_KEY);
    return res.status(200).json(data || null);
  }

  if (req.method === 'DELETE') {
    // Clear files
    await kv.del(STORAGE_KEY);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 