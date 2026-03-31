import { promises as fs } from 'fs';
import path from 'path';

const UPLOADS_DIR = path.resolve('./uploads');

function getUserFromToken(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!global.tokens || !global.tokens[token]) return null;
  return global.tokens[token];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Non autorisé' });
  const { filename } = req.body || {};
  if (!filename) return res.status(400).json({ error: 'Nom de fichier manquant.' });
  const filePath = path.join(UPLOADS_DIR, user, filename);
  try {
    await fs.unlink(filePath);
    return res.json({ success: true });
  } catch {
    return res.status(404).json({ error: 'Fichier non trouvé.' });
  }
}
