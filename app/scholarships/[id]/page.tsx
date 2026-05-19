'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/scholarships/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.scholarship) throw new Error('Bourse non trouvée');
        setScholarship(data.scholarship);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{scholarship.title}</h1>
        <p className="text-gray-600 mb-4">{scholarship.country} • {scholarship.degreeLevel} • {scholarship.fundingType}</p>
        {scholarship.university && <p className="mb-2"><span className="font-semibold">Université :</span> {scholarship.university}</p>}
        {scholarship.amount && <p className="mb-2"><span className="font-semibold">Montant :</span> {scholarship.amount} USD</p>}
        {scholarship.minGrade && <p className="mb-2"><span className="font-semibold">Note minimale requise :</span> {scholarship.minGrade}/20</p>}
        {scholarship.englishRequired && <p className="mb-2"><span className="font-semibold">Anglais requis :</span> {scholarship.englishRequired}</p>}
        <p className="mb-2"><span className="font-semibold">Date limite :</span> {new Date(scholarship.deadline).toLocaleDateString()}</p>
        {scholarship.description && <div className="mt-4"><p className="font-semibold">Description :</p><p className="text-gray-700">{scholarship.description}</p></div>}
        {scholarship.officialLink && (
          <div className="mt-4">
            <a href={scholarship.officialLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lien officiel</a>
          </div>
        )}
        <div className="mt-6">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Postuler (simulé)</button>
        </div>
      </div>
    </div>
  );
}