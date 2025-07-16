"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ToastType = "success" | "error";

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000); // some após 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-md text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Estado do toast
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setToast({ message: "As senhas novas não coincidem.", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setToast({
        message: "A nova senha deve ter pelo menos 6 caracteres.",
        type: "error",
      });
      return;
    }

    const userId = user?.id;

    if (!userId) {
      setToast({ message: "Usuário não autenticado.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao trocar a senha.");
      }

      setToast({ message: "Senha alterada com sucesso.", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">Alterar Senha</h1>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="oldPassword">Senha atual</Label>
          <Input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="newPassword">Nova senha</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Salvando..." : "Alterar Senha"}
        </Button>
      </form>
    </div>
  );
}
