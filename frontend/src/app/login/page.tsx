"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBtnLoading(true);
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (error: any) {
      setBtnLoading(false);
      const message = error?.message || "";

      if (message.includes("Usuário ou senha inválidos")) {
        toast.error("Usuário ou senha incorretos.");
      } else if (message.includes("Failed to fetch")) {
        toast.error("Servidor indisponível. Tente novamente mais tarde.");
      } else {
        toast.error("Erro inesperado ao fazer login.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <Image
            src="/logo-flexcommerce.jpg"
            alt="Flexcommerce Logo"
            width={112}
            height={112}
            className="rounded-lg p-2 shadow-md"
            draggable={false}
          />
          <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Faça login para acessar o sistema de gestão
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={btnLoading}
              autoComplete="username"
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={btnLoading}
              autoComplete="current-password"
              required
            />
            <Button type="submit" className="w-full" disabled={btnLoading}>
              {btnLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>

        <footer className="text-center pb-6 text-xs text-muted-foreground select-none">
          © {new Date().getFullYear()} Flexcommerce. Todos os direitos
          reservados.
        </footer>
      </Card>
    </div>
  );
}
