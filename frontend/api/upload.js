import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Erreur lors de l’upload.' });
    const file = files.file;
    if (!file) return res.status(400).json({ error: 'Aucun fichier.' });
    const userDir = path.join(UPLOADS_DIR, user);
    await fs.mkdir(userDir, { recursive: true });
    const dest = path.join(userDir, file.originalFilename);
    await fs.rename(file.filepath, dest);
    return res.json({ success: true });
  });
}
