import apiClient from "./apiClient";
import { User } from "./UsersService";

export interface Companie {
  id: number;
  logo?: File;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanieWithUsers extends Companie {
  users: User[];
}

export const CompanieService = {
  getAll: async (): Promise<Companie[]> => {
    const { data } = await apiClient.get("/companies/index");
    return data.data || [];
  },

  delete: async (id: number): Promise<void> => {
    const formData = new FormData();
    formData.append('id', id.toString());

    await apiClient.post('/companies/delete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  create: async (payload: { name: string; logo?: File }): Promise<Companie> => {
    const { name, logo } = payload;

    // Vérification du type de fichier : il doit commencer par "image/"
    if (logo && !logo.type.startsWith("image/")) {
      throw new Error("Le logo doit impérativement être un fichier image.");
    }

    const formData = new FormData();
    formData.append("name", name);
    if (logo) {
      formData.append("logo", logo);
    }

    const { data } = await apiClient.post("/companies/store", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // On retourne l'objet Companie créé par l'API
    return data.data as Companie;
  },
  getAllUserId: async (id: number): Promise<CompanieWithUsers> => {
    const formData = new FormData();
    formData.append('id', id.toString());
    console.log(11)


    const { data } = await apiClient.post('/companies/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(12)
    return data.data || [];
  }
};
