import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_PATH = path.resolve('./users.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Remplissez tous les champs.' });
  let users = [];
  try {
    users = JSON.parse(await fs.readFile(USERS_PATH, 'utf8'));
  } catch {
    users = [];
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Nom d’utilisateur déjà utilisé.' });
  }
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  users.push({ username, password: hash });
  await fs.writeFile(USERS_PATH, JSON.stringify(users));
  return res.json({ success: true });
}
