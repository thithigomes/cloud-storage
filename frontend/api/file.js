import { promises as fs } from 'fs';
import path from 'path';

const UPLOADS_DIR = path.resolve('./uploads');

function getUserFromToken(req) {
  const url = new URL(req.url, 'http://localhost');
  const token = url.searchParams.get('token');
  if (!global.tokens || !global.tokens[token]) return null;
  return global.tokens[token];
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' });
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Non autorisé' });
  const { searchParams } = new URL(req.url, 'http://localhost');
  const filename = searchParams.get('filename');
  if (!filename) return res.status(400).json({ error: 'Nom de fichier manquant.' });
  const filePath = path.join(UPLOADS_DIR, user, filename);
  try {
    const stat = await fs.stat(filePath);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    const file = await fs.readFile(filePath);
    res.end(file);
  } catch {
    res.status(404).json({ error: 'Fichier non trouvé.' });
  }
}
