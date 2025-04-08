// api/users.service.ts
import apiClient from './apiClient';

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  sex: 'M' | 'F';
  role: string;
  password?: string;
  status: 'active' | 'inactive';
}

  export interface RolePermissions{
    permission_id : number;
    role_id : number;
  }
  export interface ContentProps{
    id : number;
    name: string;
  }

export interface AssignRoles {
  permissions: ContentProps[];
  role_permissions: RolePermissions[];
  roles:ContentProps[];
}

export const UserService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/users/index');
    return data.data.users || [];
  },
  
  getCreateForm: async (): Promise<User> => {
    const { data } = await apiClient.get('/users/create');
    return data;
  },
  
  create: async (user: User): Promise<User> => {
    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    const { data } = await apiClient.post('/users/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data.user;
  },
  
  getEditForm: async (id: number): Promise<User> => {
    const formData = new FormData();
    formData.append('id', id.toString());
    
    const { data } = await apiClient.post('/users/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },
  
  update: async (user: User): Promise<User> => {
    try {
      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
  
      console.log("Données envoyées à l'API :", Object.fromEntries(formData.entries()));
  
      const { data } = await apiClient.put('/users/update', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return data.data.user;
    } catch (error: any) {
      console.error("Erreur de mise à jour :", error.response?.data);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    const formData = new FormData();
    formData.append('id', id.toString());
    
    await apiClient.post('/users/delete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getRoles: async (): Promise<string[]> => {
    const { data } = await apiClient.get('/users/create');
    return data.data.roles || [];
  },
  
  assignPermissions: async (roleId: number, permissions: number[]): Promise<void> => {
    const formData = new FormData();
    formData.append("role_id", roleId.toString());
  
    // Ajouter chaque permission dans le formData
    permissions.forEach((permission) => {
      formData.append("permissions[]", permission.toString()); 
    });
  
    await apiClient.post("/users/assignpermissions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
  
  assignRoles: async (): Promise<AssignRoles> => {
    const { data } = await apiClient.get(`/users/assignroles`);
    return {
      permissions: data.data.permissions || [],
      role_permissions: data.data.role_permissions || [],
      roles: data.data.roles || []
    };
  },

  
};