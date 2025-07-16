"use client";

import { useState } from "react";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Simula um fetch para backend que verifica se o email existe
    const emailExiste = await fakeCheckEmail(email);

    if (emailExiste) {
      // Simula envio do link com token (você faria isso no backend)
      setMessage(`Enviamos um link para ${email}. Verifique seu email.`);
      // Aqui você pode redirecionar ou mostrar a mensagem
    } else {
      setMessage("Email não encontrado.");
    }
  }

  async function fakeCheckEmail(email: string) {
    // Simulação: qualquer email com '@' é válido
    return email.includes("@");
  }

  return (
    <div>
      <h1>Recuperar senha</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar link de recuperação</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
