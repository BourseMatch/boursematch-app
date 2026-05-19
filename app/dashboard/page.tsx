'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification et charger le profil
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Non authentifié');
        return res.json();
      })
      .then(data => {
        if (!data.user.academicProfile) {
          // Rediriger vers le formulaire de profil
          router.push('/profile/edit');
          return;
        }
        setUser(data.user);
        // Charger les scores de matching
        return fetch('/api/matching/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({}),
        });
      })
      .then(res => {
        if (res && res.ok) return res.json();
        else throw new Error('Erreur lors du chargement des matches');
      })
      .then(data => {
        setMatches(data.matches || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;

  const topMatches = matches.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.name || user?.email}</h1>
        <p className="text-gray-600 mb-8">Voici les bourses qui correspondent le mieux à votre profil.</p>

        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Votre profil académique</h2>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Pays :</span> <span>{user.academicProfile.country}</span>
            <span className="font-medium">Niveau :</span> <span>{user.academicProfile.currentLevel}</span>
            <span className="font-medium">Domaine :</span> <span>{user.academicProfile.fieldOfStudy}</span>
            <span className="font-medium">Note moyenne :</span> <span>{user.academicProfile.averageGrade}/20</span>
            <span className="font-medium">Anglais :</span> <span>{user.academicProfile.englishLevel}</span>
          </div>
          <Link href="/profile/edit" className="inline-block mt-4 text-blue-600 hover:underline">Modifier mon profil</Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">🎓 Bourses recommandées</h2>
        <div className="space-y-4">
          {topMatches.length === 0 && <p>Aucune bourse trouvée. Revenez plus tard.</p>}
          {topMatches.map(match => (
            <div key={match.scholarshipId} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{match.title}</h3>
                <p className="text-gray-600">Score de compatibilité : {match.score}/100</p>
              </div>
              <Link
                href={`/scholarships/${match.scholarshipId}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Voir détails
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/scholarships" className="text-blue-600 hover:underline">Voir toutes les bourses</Link>
        </div>
      </div>
    </div>
  );
}