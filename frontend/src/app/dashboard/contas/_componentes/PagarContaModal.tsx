"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormatarParaReal } from "../../estoque/_componentes/formatarMoedaBR";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importa componentes Dialog do shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { tipos_pagamento } from "@/types/pagamento";

interface Pagamento {
  forma_pagamento: tipos_pagamento;
  valor: number;
  observacao?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  contaId: string;
  valorTotal: number;
  onPagamentoConcluido: () => void;
}

const formasPagamento: tipos_pagamento[] = [
  "dinheiro",
  "cartao",
  "pix",
  "boleto",
  "transferencia_bancaria",
  "cheque",
  "vale_alimentacao",
  "vale_refeicao",
  "paypal",
  "apple_pay",
  "google_pay",
  "deposito",
  "crediario",
];

export default function Modal({
  isOpen,
  onClose,
  contaId,
  valorTotal,
  onPagamentoConcluido,
}: ModalProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([
    { forma_pagamento: "dinheiro", valor: 0 },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagamentoSucesso, setPagamentoSucesso] = useState<boolean | null>(
    null
  );
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPago = pagamentos.reduce((acc, p) => acc + p.valor, 0);
  const saldo = valorTotal - totalPago;
  const podeFinalizar = totalPago > 0 && totalPago <= valorTotal;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function atualizarPagamento(idx: number, novo: Pagamento) {
    setPagamentos((prev) => {
      const clone = [...prev];
      clone[idx] = novo;
      return clone;
    });
  }

  function adicionarPagamento() {
    setPagamentos((prev) => [
      ...prev,
      { forma_pagamento: "dinheiro", valor: 0 },
    ]);
  }

  function removerPagamento(idx: number) {
    setPagamentos((prev) => prev.filter((_, i) => i !== idx));
  }

  async function confirmarPagamento() {
    try {
      setLoading(true);

      const pagamentosParaEnviar = pagamentos.map(
        ({ valor, forma_pagamento }) => ({
          valor,
          forma_pagamento,
        })
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contas-receber/pagar-pendente/${contaId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pagamentos: pagamentosParaEnviar }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao confirmar pagamento");
      }
      await onPagamentoConcluido();
      window.location.reload();
      setMensagem(
        `Conta ${contaId} paga com sucesso!\nTotal pago: R$ ${totalPago}`
      );
      setPagamentoSucesso(true);
      setDialogOpen(true);
    } catch (error) {
      setMensagem(`Erro: ${(error as Error).message}`);
      setPagamentoSucesso(false);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  }

  function handleBackgroundClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  // Fecha modal e dialog de resultado
  function fecharTudo() {
    setDialogOpen(false);
    onClose();
  }

  return ReactDOM.createPortal(
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-card/50 bg-opacity-50 p-4"
        onClick={handleBackgroundClick}
      >
        <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <h2
            id="modal-title"
            className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100"
          >
            Pagar Conta #{contaId}
          </h2>

          <div className="flex flex-col gap-6">
            {pagamentos.map((pagamento, idx) => (
              <fieldset
                key={idx}
                className="border border-gray-300 rounded-xl p-6 space-y-4 dark:border-gray-600"
              >
                <legend className="font-semibold text-lg mb-2">
                  Pagamento {idx + 1}
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`forma-pagamento-${idx}`}>
                      Forma de Pagamento
                    </Label>
                    <Select
                      value={pagamento.forma_pagamento}
                      onValueChange={(value) =>
                        atualizarPagamento(idx, {
                          ...pagamento,
                          forma_pagamento: value as tipos_pagamento,
                        })
                      }
                    >
                      <SelectTrigger id={`forma-pagamento-${idx}`}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {formasPagamento.map((forma) => (
                          <SelectItem key={forma} value={forma}>
                            {forma}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`valor-pagamento-${idx}`}>Valor (R$)</Label>
                    <FormatarParaReal
                      value={pagamento.valor}
                      onChange={(novoValor) =>
                        atualizarPagamento(idx, {
                          ...pagamento,
                          valor: novoValor ?? 0,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      onClick={() => removerPagamento(idx)}
                      className="w-full"
                      aria-label={`Remover pagamento ${idx + 1}`}
                    >
                      Remover
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor={`obs-pagamento-${idx}`}>Observação</Label>
                  <Input
                    id={`obs-pagamento-${idx}`}
                    value={pagamento.observacao || ""}
                    onChange={(e) =>
                      atualizarPagamento(idx, {
                        ...pagamento,
                        observacao: e.target.value,
                      })
                    }
                    placeholder="Opcional"
                  />
                </div>
              </fieldset>
            ))}

            <Button
              onClick={adicionarPagamento}
              variant="outline"
              className="w-fit self-start"
              aria-label="Adicionar pagamento"
            >
              Adicionar pagamento
            </Button>

            {/* Resumo */}
            <div className="border-t pt-4 mt-2 space-y-1 text-base text-gray-800 dark:text-gray-200">
              <p>
                <strong>Total da Conta:</strong> R$ {valorTotal}
              </p>
              <p>
                <strong>Total Pago:</strong> R$ {totalPago}
              </p>
              <p>
                <strong>Saldo:</strong>{" "}
                <span className={saldo > 0 ? "text-red-600" : "text-green-600"}>
                  R$ {saldo}
                </span>
              </p>
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={confirmarPagamento}
                disabled={!podeFinalizar || loading}
              >
                {loading ? "Carregando..." : "Confirmar Pagamento"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog do resultado do pagamento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={`max-w-md rounded-lg shadow-lg ${
            pagamentoSucesso === false ? "bg-red-600 text-white" : ""
          }`}
        >
          <DialogHeader>
            <DialogTitle>
              {pagamentoSucesso ? "Pagamento Confirmado" : "Falha no Pagamento"}
            </DialogTitle>
            <DialogDescription>{mensagem}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={fecharTudo}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>,
    document.body
  );
}
