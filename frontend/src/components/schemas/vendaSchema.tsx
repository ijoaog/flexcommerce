import { z } from "zod";

export const formaPagamentoSchema = z.enum([
  "dinheiro",
  "cartao",
  "pix",
  "marcar_na_conta",
]);

export const vendaItemSchema = z.object({
  produto_id: z.number(),
  quantidade: z.number().min(1, "A quantidade deve ser no mínimo 1"),
  responsavel_produto: z.enum(["", "ana", "patricia"]),
  preco_unitario: z
    .number()
    .nonnegative("O preço unitário não pode ser negativo"),
});

export const vendaSchema = z.object({
  cliente_id: z.number().optional(),
  forma_pagamento: formaPagamentoSchema,
  pago_parcial: z
    .number()
    .nonnegative("Valor pago parcialmente não pode ser negativo")
    .optional(),
  itens: z.array(vendaItemSchema).min(1, "Adicione pelo menos um produto"),
});
