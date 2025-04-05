// pages/UserDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsers } from "@/contexts/UserContext";
import { Mission } from "@/services/missions.service";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserById, getAgentMissions } = useUsers();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState<boolean>(false);

  // Récupérer l'agent par son id
  const agent = id ? getUserById(parseInt(id)) : undefined;

  useEffect(() => {
    const fetchMissions = async () => {
      // Vérifier que l'agent existe et possède un id
      if (agent && agent.id) {
        setLoadingMissions(true);
        try {
          const agentMissions = await getAgentMissions(agent.id);
          setMissions(agentMissions);
        } catch (error) {
          toast.error("Erreur lors de la récupération des missions");
        } finally {
          setLoadingMissions(false);
        }
      }
    };
    fetchMissions();
  }, [agent, getAgentMissions]);

  if (!agent || !agent.id) {
    return (
      <div className="container mx-auto p-4">
        {/* Bouton de retour */}
        <Button
          variant="outline"
          onClick={() => navigate("/users")}
          className="mb-4"
        >
          Retour
        </Button>
        <Alert variant="destructive">Agent non trouvé.</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Bouton de retour */}
      <Button
          variant="outline"
          onClick={() => navigate("/users")}
          className="mb-4"
        >
          Retour
        </Button>
      <h1 className="text-3xl font-bold mb-4">Détails de l'Agent</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Colonne détails de l'agent */}
        <div className="md:w-1/3 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Informations</h2>
          <p>
            <strong>Nom :</strong> {agent.name}
          </p>
          <p>
            <strong>Email :</strong> {agent.email}
          </p>
          <p>
            <strong>Téléphone :</strong> {agent.phone}
          </p>
          <p>
            <strong>Sexe :</strong> {agent.sex === "M" ? "Masculin" : "Féminin"}
          </p>
          <p>
            <strong>Rôle :</strong> {agent.role}
          </p>
        </div>

        {/* Colonne liste des missions */}
        <div className="md:w-2/3 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Missions assignées</h2>
          {loadingMissions ? (
            <div className="flex justify-center py-4">
              <Spinner className="h-8 w-8" />
            </div>
          ) : missions.length === 0 ? (
            <p>Aucune mission assignée à cet agent.</p>
          ) : (
            <ul className="space-y-2">
              {missions.map((mission) => (
                <li key={mission.id} className="p-2 border rounded">
                  <p className="font-medium">{mission.title}</p>
                  <p className="text-sm text-gray-600">{mission.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
