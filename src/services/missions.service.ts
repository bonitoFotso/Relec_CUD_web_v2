// services/MissionsService.ts
import { AxiosResponse, AxiosError } from "axios";
import apiClient from "./apiClient";
import { Sticker } from "./stickers.service";

// Interfaces de base
export interface Mission {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  street_id: number;
  intervention_type_id: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Relations
  user?: {
    id: number;
    name: string;
  };
  street?: {
    id: number;
    name: string;
  };
  intervention_type?: {
    id: number;
    name: string;
  };
  agents?: Agent[];
}

export interface Agent {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

export interface Street {
  id: number;
  name: string;
}

export interface InterventionType {
  id: number;
  name: string;
}

// Interfaces de réponse API
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
}

export interface MissionsDetailsResponse {
  status: boolean;
  message: string;
  agents: Agent[];
  mission: Mission;
  stickers: Sticker[];
}

export interface MissionFormData {
  agents?: Agent[];
  streets?: Street[];
  interventions?: InterventionType[];
}

// Classe de service pour les missions
export const MissionsService = {
  /**
   * Récupère toutes les missions
   * @returns Promise<Mission[]> - Liste des missions
   */
  getAll: async (): Promise<Mission[]> => {
    try {
      const response: AxiosResponse<ApiResponse<Mission[]>> =
        await apiClient.get("/missions/index");

      if (!response.data.status) {
        throw new Error(
          response.data.message || "Erreur lors de la récupération des missions"
        );
      }

      return response.data.data || [];
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : (error as Error).message;

      console.error("Erreur dans MissionsService.getAll:", errorMessage);
      throw new Error(`Impossible de récupérer les missions: ${errorMessage}`);
    }
  },

  /**
   * Récupère une mission par son ID
   * @param id - ID de la mission
   * @returns Promise<MissionsDetailsResponse> - Détails de la mission
   */
  getById: async (id: number): Promise<MissionsDetailsResponse> => {
    try {
      const formData = new FormData();
      formData.append("id", id.toString());

      const response: AxiosResponse<MissionsDetailsResponse> =
        await apiClient.post("/missions/show", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      if (!response.data.status || !response.data) {
        throw new Error(response.data.message || "Mission non trouvée");
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : (error as Error).message;

      console.error(
        `Erreur dans MissionsService.getById(${id}):`,
        errorMessage
      );
      throw new Error(`Mission non trouvée (ID: ${id}): ${errorMessage}`);
    }
  },

  /**
   * Récupère les données nécessaires pour le formulaire de création
   * @returns Promise<MissionFormData> - Données pour le formulaire
   */
  getCreateFormData: async (): Promise<MissionFormData> => {
    try {
      const response: AxiosResponse<any> = await apiClient.get(
        "/missions/create"
      );
      if (!response.data.status) {
        throw new Error(
          response.data.message ||
            "Erreur lors de la récupération des données du formulaire"
        );
      }
      // Extraction des données directement depuis response.data
      const { agents, streets, interventions } = response.data;
      return { agents, streets, interventions };
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : (error as Error).message;
      console.error(
        "Erreur dans MissionsService.getCreateFormData:",
        errorMessage
      );
      throw new Error(
        `Impossible de récupérer les données du formulaire: ${errorMessage}`
      );
    }
  },

  /**
   * Crée une nouvelle mission
   * @param mission - Données de la mission à créer
   * @returns Promise<Mission> - Mission créée
   */
  create: async (mission: Mission): Promise<Mission> => {
    try {
      const formData = prepareFormData(mission);

      const response: AxiosResponse<ApiResponse<Mission>> =
        await apiClient.post("/missions/store", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      if (!response.data.status || !response.data.data) {
        throw new Error(
          response.data.message || "Erreur lors de la création de la mission"
        );
      }
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : (error as Error).message;

      console.error("Erreur dans MissionsService.create:", errorMessage);
      throw new Error(`Impossible de créer la mission: ${errorMessage}`);
    }
  },

  /**
   * Récupère les données pour le formulaire d'édition
   * @param id - ID de la mission à éditer
   * @returns Promise<{mission: Mission; formData: MissionFormData}> - Données pour le formulaire
   */
  getEditFormData: async (
    id: number
  ): Promise<{ mission: Mission; formData: MissionFormData }> => {
    try {
      const formData = new FormData();
      formData.append("id", id.toString());

      const response: AxiosResponse<
        ApiResponse<{ mission: Mission; data: MissionFormData }>
      > = await apiClient.post("/missions/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.status || !response.data.data) {
        throw new Error(
          response.data.message ||
            "Erreur lors de la récupération des données de la mission"
        );
      }

      return {
        mission: response.data.data.mission,
        formData: response.data.data.data || {},
      };
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : (error as Error).message;

      console.error(
        `Erreur dans MissionsService.getEditFormData(${id}):`,
        errorMessage
      );
      throw new Error(
        `Impossible de récupérer les données pour l'édition (ID: ${id}): ${errorMessage}`
      );
    }
  },

  /**
   * Met à jour une mission existante
   * @param mission - Données mises à jour de la mission
   * @returns Promise<Mission> - Mission mise à jour
   */
  update: async (mission: Mission): Promise<Mission> => {
    try {
      if (!mission.id) {
        throw new Error("ID de mission requis pour la mise à jour");
      }

      const formData = prepareFormData(mission);

      const response: AxiosResponse<{ mission: Mission }> =
        await apiClient.post("/missions/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      if (!response.data.mission) {
        throw new Error("Erreur lors de la mise à jour de la mission");
      }

      return response.data.mission;
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : (error as Error).message;

      console.error(
        `Erreur dans MissionsService.update(${mission.id}):`,
        errorMessage
      );
      throw new Error(
        `Impossible de mettre à jour la mission (ID: ${mission.id}): ${errorMessage}`
      );
    }
  },

  /**
   * Supprime une mission
   * @param id - ID de la mission à supprimer
   * @returns Promise<void>
   */
  delete: async (id: number): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("id", id.toString());

      const response: AxiosResponse<ApiResponse<null>> = await apiClient.post(
        "/missions/delete",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!response.data.status) {
        throw new Error(
          response.data.message || "Erreur lors de la suppression de la mission"
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : (error as Error).message;

      console.error(`Erreur dans MissionsService.delete(${id}):`, errorMessage);
      throw new Error(
        `Impossible de supprimer la mission (ID: ${id}): ${errorMessage}`
      );
    }
  },

  /**
   * Assigne un agent à une mission
   * @param missionId - ID de la mission
   * @param userId - ID de l'agent
   * @returns Promise<void>
   */
  assignAgent: async (missionId: number, userId: number): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("mission_id", missionId.toString());
      formData.append("user_id", userId.toString());

      const response: AxiosResponse<ApiResponse<null>> = await apiClient.post(
        "/missions/assign-mission-agents",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!response.data.status) {
        throw new Error(
          response.data.message ||
            "Erreur lors de l'assignation de l'agent à la mission"
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : (error as Error).message;

      console.error(
        `Erreur dans MissionsService.assignAgent(${missionId}, ${userId}):`,
        errorMessage
      );
      throw new Error(
        `Impossible d'assigner l'agent (ID: ${userId}) à la mission (ID: ${missionId}): ${errorMessage}`
      );
    }
  },
  /**
   * Récupère les missions assignées à un agent
   * @param userId - ID de l'agent
   * @returns Promise<Mission[]> - Liste des missions assignées à l'agent
   */

  getMissionsByAgent: async (userId: number): Promise<Mission[]> => {
    try {
      const formData = new FormData();
      formData.append("id", userId.toString());
      console.log(userId);
      const response: AxiosResponse<ApiResponse<Mission[]>> =
        await apiClient.post("/missions/agent-missions", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      console.log("donnees des missions", response.data);
      if (!response.data.status) {
        throw new Error(
          response.data.message ||
            "Erreur lors de la récupération des missions assignées"
        );
      }

      return response.data.data || [];
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : (error as Error).message;

      console.error(
        `Erreur dans MissionsService.getMissionsByAgent(${userId}):`,
        errorMessage
      );
      throw new Error(
        `Impossible de récupérer les missions assignées (ID agent: ${userId}): ${errorMessage}`
      );
    }
  },
};

/**
 * Prépare les données de formulaire à partir d'un objet mission
 * @param mission - Objet mission
 * @returns FormData - Données formulaire
 */
function prepareFormData(mission: Mission): FormData {
  const formData = new FormData();

  // Conversion des objets et tableaux en JSON si nécessaire
  Object.entries(mission).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        // Pour les tableaux ou objets, on les convertit en JSON
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return formData;
}

export default MissionsService;
