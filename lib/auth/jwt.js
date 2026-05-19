import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'un_secret_temporaire_pour_dev';

// Générer un token JWT
export function generateToken(userId, email, role = 'user') {
  return jwt.sign(
    { userId, email, role },
    SECRET,
    { expiresIn: '7d' }
  );
}

// Vérifier un token
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}