'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    country: '',
    currentLevel: '',
    fieldOfStudy: '',
    averageGrade: '',
    englishLevel: '',
    budget: '',
    targetCountries: '',
    fundingType: '',
  });
  const router = useRouter();

  useEffect(() => {
    // Récupérer le profil existant s'il y en a un
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.academicProfile) {
          const p = data.user.academicProfile;
          setProfile({
            country: p.country || '',
            currentLevel: p.currentLevel || '',
            fieldOfStudy: p.fieldOfStudy || '',
            averageGrade: p.averageGrade?.toString() || '',
            englishLevel: p.englishLevel || '',
            budget: p.budget?.toString() || '',
            targetCountries: p.targetCountries?.join(', ') || '',
            fundingType: p.fundingType || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Transformer targetCountries en tableau
    const targetCountriesArray = profile.targetCountries.split(',').map(c => c.trim()).filter(c => c);

    const payload = {
      ...profile,
      averageGrade: profile.averageGrade ? parseFloat(profile.averageGrade) : null,
      budget: profile.budget ? parseFloat(profile.budget) : null,
      targetCountries: targetCountriesArray,
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de l\'enregistrement');
      }

      // Rediriger vers le dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Complétez votre profil académique</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Pays d'origine</label>
            <input
              type="text"
              value={profile.country}
              onChange={(e) => setProfile({...profile, country: e.target.value})}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Niveau actuel</label>
            <select
              value={profile.currentLevel}
              onChange={(e) => setProfile({...profile, currentLevel: e.target.value})}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Sélectionnez</option>
              <option value="Bachelor">Bachelor (Licence)</option>
              <option value="Master">Master</option>
              <option value="PhD">Doctorat (PhD)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Domaine d'études</label>
            <input
              type="text"
              value={profile.fieldOfStudy}
              onChange={(e) => setProfile({...profile, fieldOfStudy: e.target.value})}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Note moyenne (sur 20)</label>
            <input
              type="number"
              step="0.1"
              value={profile.averageGrade}
              onChange={(e) => setProfile({...profile, averageGrade: e.target.value})}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Niveau d'anglais</label>
            <select
              value={profile.englishLevel}
              onChange={(e) => setProfile({...profile, englishLevel: e.target.value})}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Sélectionnez</option>
              <option value="A1">A1 (Débutant)</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1 (Avancé)</option>
              <option value="C2">C2 (Courant)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Budget annuel (USD) – optionnel</label>
            <input
              type="number"
              step="1000"
              value={profile.budget}
              onChange={(e) => setProfile({...profile, budget: e.target.value})}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Pays cibles (séparés par des virgules)</label>
            <input
              type="text"
              value={profile.targetCountries}
              onChange={(e) => setProfile({...profile, targetCountries: e.target.value})}
              placeholder="France, Canada, Allemagne"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Type de financement préféré</label>
            <select
              value={profile.fundingType}
              onChange={(e) => setProfile({...profile, fundingType: e.target.value})}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Indifférent</option>
              <option value="Fully Funded">Entièrement financée</option>
              <option value="Partial">Partielle</option>
              <option value="Tuition only">Frais de scolarité uniquement</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer mon profil'}
          </button>
        </form>
      </div>
    </div>
  );
}