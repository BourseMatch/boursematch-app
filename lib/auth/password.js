import bcrypt from 'bcryptjs';

// Hacher un mot de passe
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Vérifier un mot de passe en clair par rapport au hash
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}