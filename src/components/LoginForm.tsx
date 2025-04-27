// src/components/LoginForm.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Import des composants shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import LogoCustom from "./layout/Logo";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit prevented, loading:", loading);
    setError("");
    try {
      await login(email, password);
      // Redirection après connexion réussie
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const displayError = error || authError;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="px-4 md:px-0 flex justify-center items-center bg-white dark:bg-gray-600">
      <Card className="max-w-md bg-white">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <LogoCustom size="xl" showTitle={false} />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Connexion
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayError && (
            <Alert
              variant="destructive"
              className="mb-6 flex items-center gap-2"
            >
              <div>
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <AlertDescription>{displayError}</AlertDescription>
              </div>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-gray-800">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 text-gray-800">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-500 hover:underline"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default LoginForm;