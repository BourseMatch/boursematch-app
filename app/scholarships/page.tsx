'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/scholarships')
      .then(res => res.json())
      .then(data => {
        setScholarships(data.scholarships);
        setLoading(false);
      })
      .catch(() => {
        setError('Impossible de charger les bourses');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Toutes les bourses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map((scholarship: any) => (
            <div key={scholarship.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{scholarship.title}</h2>
              <p className="text-gray-600">{scholarship.country} • {scholarship.degreeLevel}</p>
              <p className="text-sm text-gray-500 mt-2">Date limite : {new Date(scholarship.deadline).toLocaleDateString()}</p>
              <Link
                href={`/scholarships/${scholarship.id}`}
                className="inline-block mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Détails
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}