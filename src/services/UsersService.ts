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
    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
        console.log(key, value);
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    console.log(formData);
    
    const { data } = await apiClient.post('/users/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data.data.user;
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
    console.log(data.data.roles);
    return data.data.roles || [];
  },
  
  assignPermissions: async (roleId: number, permissions: number[]): Promise<void> => {
    const formData = new FormData();
    formData.append('role_id', roleId.toString());
    formData.append('permissions', permissions.join(','));
    
    await apiClient.post('/users/assignpermissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};