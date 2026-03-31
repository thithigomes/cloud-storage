import { promises as fs } from 'fs';
import path from 'path';

const UPLOADS_DIR = path.resolve('./uploads');

function getUserFromToken(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!global.tokens || !global.tokens[token]) return null;
  return global.tokens[token];
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' });
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Non autorisé' });
  const userDir = path.join(UPLOADS_DIR, user);
  try {
    await fs.mkdir(userDir, { recursive: true });
    const files = await fs.readdir(userDir);
    return res.json({ files });
  } catch {
    return res.json({ files: [] });
  }
}
