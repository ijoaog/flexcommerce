"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetSenhaComTokenPage() {
  const searchParams = useSearchParams();
  const tokenrecsenha = searchParams.get("tokenrecsenha") || "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (novaSenha !== confirmaSenha) {
      setMessage("As senhas não conferem");
      return;
    }

    // Aqui você chamaria seu backend para validar o token e atualizar a senha
    const sucesso = await fakeResetSenha(tokenrecsenha, novaSenha);

    if (sucesso) {
      setMessage("Senha atualizada com sucesso!");
      // Redirecione para login ou outra página
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage("Token inválido ou expirado.");
    }
  }

  async function fakeResetSenha(token: string, senha: string) {
    // Simula backend
    return token.length > 5 && senha.length >= 6;
  }

  if (!tokenrecsenha) {
    return <p>Token de recuperação não fornecido.</p>;
  }

  return (
    <div>
      <h1>Redefinir senha</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirme a nova senha"
          value={confirmaSenha}
          onChange={(e) => setConfirmaSenha(e.target.value)}
          required
        />
        <button type="submit">Redefinir senha</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
