// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import Disclaimer from '@/components/Disclaimer';

interface DiagnoseResponse {
  diagnosis?: string;
  further_questions?: string[];
  recommended_analyses?: string[];
  suggested_treatment?: string[];
  risks_and_warnings?: string;
  disclaimer?: string; // Le disclaimer peut aussi venir de l'API
  error?: string; // Pour les erreurs métier de l'API
}

interface DiagnoseRequest {
  age?: number;
  sex?: string;
  symptoms?: string[];
  history?: string[];
}

export default function HomePage() {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [history, setHistory] = useState('');

  const [apiResponse, setApiResponse] = useState<DiagnoseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setApiResponse(null); // Clear previous response

    const symptomsArray = symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const historyArray = history.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const requestData: DiagnoseRequest = {
      age: age ? parseInt(age, 10) : undefined,
      sex: sex || undefined,
      symptoms: symptomsArray.length > 0 ? symptomsArray : undefined,
      history: historyArray.length > 0 ? historyArray : undefined,
    };
    
    if (age && isNaN(requestData.age!)) {
        requestData.age = undefined;
    }

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: DiagnoseResponse = await response.json();

      if (response.ok) {
        setApiResponse(data);
      } else {
        setError(data.error || `Erreur du serveur: ${response.status} ${response.statusText}`);
        setApiResponse(null);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Impossible de contacter le serveur (${errorMessage}). Veuillez réessayer plus tard.`);
      setApiResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12"> {/* Ajustement du padding pour petits écrans */}
      <div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm flex flex-col"> {/* Max-width ajusté pour le contenu centré */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Assistant Médical IA</h1>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="w-full bg-white shadow-md rounded px-6 py-8 md:px-8 mb-6">
           <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
              Âge
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="age"
              type="number"
              placeholder="Votre âge"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sex">
              Sexe
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="">Sélectionnez...</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symptoms">
              Symptômes (séparés par une virgule)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="symptoms"
              rows={3}
              placeholder="Ex: fièvre, toux, fatigue"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="history">
              Antécédents médicaux (séparés par une virgule)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="history"
              rows={2}
              placeholder="Ex: hypertension, diabète"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Analyse en cours...' : 'Soumettre'}
            </button>
          </div>
        </form>

        {/* SECTION D'AFFICHAGE DES RÉSULTATS ET ERREURS */}
        {loading && <p className="text-center mt-4 text-blue-600">Analyse en cours...</p>}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded w-full">
            <h3 className="font-bold">Erreur</h3>
            <p>{error}</p>
          </div>
        )}

        {apiResponse && !error && (
          <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded w-full shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-green-800">Résultats de l'analyse :</h2>
            
            {apiResponse.diagnosis && (
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-700">Diagnostic probable :</h3>
                <p className="text-gray-600">{apiResponse.diagnosis}</p>
              </div>
            )}

            {apiResponse.further_questions && apiResponse.further_questions.length > 0 && (
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-700">Questions complémentaires :</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {apiResponse.further_questions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            )}

            {apiResponse.recommended_analyses && apiResponse.recommended_analyses.length > 0 && (
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-700">Analyses recommandées :</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {apiResponse.recommended_analyses.map((analysis, index) => (
                    <li key={index}>{analysis}</li>
                  ))}
                </ul>
              </div>
            )}

            {apiResponse.suggested_treatment && apiResponse.suggested_treatment.length > 0 && (
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-700">Suggestions de traitement :</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {apiResponse.suggested_treatment.map((treatment, index) => (
                    <li key={index}>{treatment}</li>
                  ))}
                </ul>
              </div>
            )}

            {apiResponse.risks_and_warnings && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded">
                <h4 className="font-bold">Avertissements importants :</h4>
                <p>{apiResponse.risks_and_warnings}</p>
              </div>
            )}
            
            {/* Affichage du disclaimer de l'API s'il existe */}
            {apiResponse.disclaimer && (
              <div className="mt-4 p-3 bg-gray-100 border border-gray-300 text-gray-600 rounded">
                 <p className="text-sm italic">{apiResponse.disclaimer}</p>
              </div>
            )}
          </div>
        )}
        {/* FIN SECTION D'AFFICHAGE */}

        <Disclaimer /> {/* Le disclaimer général du site */}
      </div>
    </main>
  );
}
