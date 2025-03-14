// src/services/AuthService.ts

import { AxiosError } from "axios";
import apiClient from "./apiClient";

// Type definitions
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  sex: string;
  email_verified_at: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  // Ajoutez d'autres champs d'inscription selon vos besoins
}

// Récupération de l'URL du backend depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class AuthService {
  // Stockage du token dans le localStorage
  private setToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  // Récupération du token depuis le localStorage
  public getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  // Stockage des informations utilisateur
  private setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Récupération des informations utilisateur
  public getUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  private setRoles(roles: Role[]): void {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles(): Role[] {
    const rolesStr = localStorage.getItem("roles");
    if (rolesStr) {
      return JSON.parse(rolesStr);
    }
    return [];
  }

  // Vérification si l'utilisateur est connecté
  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
  // Configuration de l'en-tête d'autorisation pour les requêtes
  public getAuthHeader(): { Authorization: string } | Record<string, never> {
    const token = this.getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  // Récupération des rôles de l'utilisateur
  public getUserRoles(): Role[] {
    const user = this.getUser();
    return user?.roles || [];
  }

  // Vérification si l'utilisateur a un rôle spécifique
  public hasRole(roleName: string): boolean {
    const roles = this.getUserRoles();
    return roles.some((role) => role.name === roleName);
  }

  // Connexion utilisateur
  public async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiClient.post(`${API_URL}/login`, credentials);

      // Adaptation à la structure de réponse spécifique
      if (response.data.success && response.data.data) {
        const { token, user, roles } = response.data.data;

        this.setToken(token);
        this.setUser(user);
        this.setRoles(roles);
        return user;
      } else {
        throw new Error(response.data.message || "Échec de la connexion");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  // Inscription utilisateur
  public async register(data: RegisterData): Promise<User> {
    try {
      const response = await apiClient.post(`${API_URL}/register`, data);
      const { token, user } = response.data;

      this.setToken(token);
      this.setUser(user);

      return user;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  // Déconnexion utilisateur
  public logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
  }

  // Récupération du profil utilisateur
  public async getCurrentUser(): Promise<User> {
    try {
      // const response = await axios.get(`${API_URL}/me`, {
      //   headers: this.getAuthHeader(),
      // });

      // Adaptation à la structure de réponse
      // if (response.data.success && response.data.data) {
      //   const user = response.data.data.user;
      //   this.setUser(user);
      //   return user;
      const user = this.getUser();
      if (user) {
        return user;
      } else {
        throw new Error("Échec de la récupération du profil");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  // Vérification de validité du token
  public async validateToken(): Promise<boolean> {
    if (!this.getToken()) return false;

    try {
      // await this.getCurrentUser();
      return true;
    } catch (error) {
      console.log(error);
      this.logout();
      return false;
    }
  }

  // Mise à jour du token (utile pour l'implémentation du refresh token)
  public async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post(
        `${API_URL}/refresh-token`,
        {},
        {
          headers: this.getAuthHeader(),
        }
      );

      const { token } = response.data;
      this.setToken(token);

      return token;
    } catch (error) {
      this.logout();
      if (error instanceof AxiosError) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  // Gestion des erreurs
  private handleError(error: AxiosError): Error {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const message =
        (error.response.data as { message?: string }).message ||
        "Une erreur est survenue";
      return new Error(message);
    }
    if (error.request) {
      console.log(error.request);
      // La requête a été effectuée mais pas de réponse reçue
      return new Error(
        "Le serveur ne répond pas. Veuillez réessayer plus tard."
      );
    }
    // Une erreur s'est produite lors de la configuration de la requête
    return new Error("Erreur de configuration de la requête");
  }
}

export default new AuthService();
