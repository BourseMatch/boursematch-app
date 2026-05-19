'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté en appelant /api/auth/me
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? setIsLoggedIn(true) : setIsLoggedIn(false))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">BourseMatch</Link>
      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Déconnexion</button>
          </>
        ) : (
          <>
            <Link href="/login">Connexion</Link>
            <Link href="/register" className="bg-blue-600 px-3 py-1 rounded">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
}