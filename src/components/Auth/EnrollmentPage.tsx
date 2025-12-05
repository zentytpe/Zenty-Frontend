import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const EnrollmentPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'idle' | 'authorizing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!isLoading && !user) {
      // Pas connecté → redirige vers la landing page tout en conservant session_id
      navigate(`/?login=1&session_id=${sessionId}`);
    }
  }, [isLoading, user, navigate, sessionId]);

  const handleAuthorize = async () => {
    if (!sessionId || !user) return;
    try {
      setStatus('authorizing');
      const token = localStorage.getItem('zenty_token');
      const response = await fetch(`${API_URL}/api/v1/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-auth-token': token ?? '',
        },
        body: JSON.stringify({ user_id: user._id }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('success');
      // Message puis redirection après 2 s
      setTimeout(() => navigate('/palm'), 2000);
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  if (isLoading || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">Chargement…</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Autoriser l'enregistrement de votre paume</h1>
      <p className="mb-6 text-center max-w-md">Une fois autorisé, placez votre main sur le terminal pour finaliser l'enrôlement.</p>

      {status === 'success' ? (
        <p className="text-green-600 font-semibold">Autorisation réussie ! Vous pouvez retourner au terminal.</p>
      ) : (
        <button
          onClick={handleAuthorize}
          disabled={status === 'authorizing'}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {status === 'authorizing' ? 'Autorisation…' : 'Autoriser'}
        </button>
      )}

      {status === 'error' && (
        <p className="text-red-600 mt-4">Erreur : {errorMsg}</p>
      )}
    </div>
  );
};

export default EnrollmentPage; 