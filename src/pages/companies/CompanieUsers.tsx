import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {CompanieWithUsers, CompanieService } from '@/services/companieService';


const CompanieUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [companie, setCompanie] = useState<CompanieWithUsers | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanieWithUsers = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await CompanieService.getAllUserId(Number(id));
        setCompanie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inattendue');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanieWithUsers();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Skeleton className="h-[20vh] w-[80%]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Erreur : {error}</div>;
  }

  if (!companie) {
    return <p>Compagnie introuvable.</p>;
  }

  return (
    <div className="m-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{companie.name}</h1>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Créée le {companie.created_at && new Date(companie.created_at).toLocaleDateString()}
      </p>

      {companie.users.length === 0 ? (
        <p>Aucun utilisateur pour cette compagnie.</p>
      ) : (
        <ul className="space-y-2">
          {companie.users.map((user) => (
            <li
              key={user.id}
              className="p-4 bg-white rounded-md shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <Button size="sm" onClick={() => {/* voir détails si besoin */}}>
                Détails
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanieUsers;