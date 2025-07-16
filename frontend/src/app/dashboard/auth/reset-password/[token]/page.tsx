"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao trocar a senha");
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      // Opcional: redirecionar após sucesso
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
        <p className="text-red-500">Token inválido ou ausente.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Redefinir Senha</h1>

      {success ? (
        <p className="text-green-600 mb-4">
          Senha alterada com sucesso! Você será redirecionado para o login...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Nova senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Confirmar nova senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Alterando..." : "Alterar Senha"}
          </button>
        </form>
      )}
    </div>
  );
}
