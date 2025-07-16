"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TipoPagamento = "dinheiro" | "cartao" | "marcar_na_conta" | "cheque";

interface Pagamento {
  forma_pagamento: TipoPagamento;
  valor: number;
  observacao?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  contaId: string;
  valorTotal: number;
}

const formasPagamento: TipoPagamento[] = [
  "dinheiro",
  "cartao",
  "marcar_na_conta",
  "cheque",
];

export default function Modal({
  isOpen,
  onClose,
  contaId,
  valorTotal,
}: ModalProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([
    { forma_pagamento: "dinheiro", valor: 0 },
  ]);

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
  }, [isOpen, onClose]); // << Incluído onClose aqui

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

  function confirmarPagamento() {
    alert(
      `Conta ${contaId} paga com sucesso!\nTotal pago: R$ ${totalPago.toFixed(
        2
      )}`
    );
    onClose();
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl z-50 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Pagar Conta #{contaId}</h2>

        <div className="flex flex-col gap-6">
          {pagamentos.map((pagamento, idx) => {
            const isConta = pagamento.forma_pagamento === "marcar_na_conta";
            return (
              <fieldset key={idx} className="border rounded p-4">
                <legend className="font-semibold mb-2">
                  Pagamento {idx + 1}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Forma */}
                  <div>
                    <Label>Forma de Pagamento</Label>
                    <Select
                      value={pagamento.forma_pagamento}
                      onValueChange={(value) =>
                        atualizarPagamento(idx, {
                          ...pagamento,
                          forma_pagamento: value as TipoPagamento,
                        })
                      }
                    >
                      <SelectTrigger>
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

                  {/* Valor */}
                  <div>
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={pagamento.valor}
                      onChange={(e) =>
                        atualizarPagamento(idx, {
                          ...pagamento,
                          valor: Number(e.target.value),
                        })
                      }
                      className={
                        isConta ? "border-yellow-400 bg-yellow-50" : ""
                      }
                    />
                  </div>

                  {/* Remover */}
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      onClick={() => removerPagamento(idx)}
                      className="w-full"
                    >
                      Remover
                    </Button>
                  </div>
                </div>

                {/* Observação */}
                <div className="mt-2">
                  <Label>Observação</Label>
                  <Input
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
            );
          })}

          <Button
            onClick={adicionarPagamento}
            variant="outline"
            className="w-fit"
          >
            Adicionar pagamento
          </Button>

          {/* Resumo */}
          <div className="border-t pt-4 mt-2">
            <p>
              <strong>Total da Conta:</strong> R$ {valorTotal.toFixed(2)} <br />
              <strong>Total Pago:</strong> R$ {totalPago.toFixed(2)} <br />
              <strong>Saldo:</strong>{" "}
              <span className={saldo > 0 ? "text-red-600" : "text-green-600"}>
                R$ {saldo.toFixed(2)}
              </span>
            </p>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={confirmarPagamento} disabled={!podeFinalizar}>
              Confirmar Pagamento
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
