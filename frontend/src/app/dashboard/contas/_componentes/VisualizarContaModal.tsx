"use client";

import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "@/components/ui/button";

interface VisualizarContaModalProps {
  isOpen: boolean;
  onClose: () => void;
  conta: any;
}

export default function VisualizarContaModal({
  isOpen,
  onClose,
  conta,
}: VisualizarContaModalProps) {
  // Controla overflow do body e esc para fechar
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    } else {
      window.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !conta) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-card/50"
      onClick={onClose} // fecha ao clicar fora do modal
    >
      <div
        className="rounded-2xl p-6 max-w-md w-full shadow-xl bg-card"
        onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro do modal
      >
        <h2 className="text-xl font-bold mb-2">
          Detalhes da Conta #{conta.id}
        </h2>
        <p className="">Aqui estão os detalhes da conta selecionada.</p>

        <div className="space-y-3">
          <p>
            <strong>Cliente:</strong> {conta.cliente?.nome ?? "-"}
          </p>
          <p>
            <strong>Valor:</strong>{" "}
            {conta.valor?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }) ?? "-"}
          </p>
          <p>
            <strong>Data da Venda:</strong>{" "}
            {conta.venda?.data_venda
              ? new Date(conta.venda.data_venda).toLocaleDateString("pt-BR")
              : "-"}
          </p>
          <p>
            <strong>Data de Vencimento:</strong>{" "}
            {conta.data_vencimento
              ? new Date(conta.data_vencimento).toLocaleDateString("pt-BR")
              : "-"}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
