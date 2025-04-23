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
  create: async (compagnie: Companie): Promise<Companie> => {
    const formData = new FormData();
    formData.append("name", compagnie.name);
  
    // Si on a un fichier, on l'ajoute tel quel :
    if (compagnie.logo instanceof File) {
      formData.append("logo", compagnie.logo);
    }
  
    // Envoie sans header explicite
    const { data } = await apiClient.post("/companies/store", formData);
    console.log(data)
    return data;
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
