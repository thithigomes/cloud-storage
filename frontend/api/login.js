import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_PATH = path.resolve('./users.json');

function generateToken() {
  return crypto.randomBytes(24).toString('hex');
}

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
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const user = users.find(u => u.username === username && u.password === hash);
  if (!user) return res.status(401).json({ error: 'Identifiants invalides.' });
  // Simples tokens em memória (para demo)
  const token = generateToken();
  global.tokens = global.tokens || {};
  global.tokens[token] = username;
  return res.json({ token });
}
