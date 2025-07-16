import { criarVenda } from '@/api/vendas';
import { criarVendaItem } from '@/api/venda_itens';
import { criarPagamento } from '@/api/pagamento';
import { criarContaReceber } from '@/api/contas_pendentes';

import {VendaForm} from "@/types/venda";

export async function salvarVenda(vendaForm: VendaForm) {
  // Cria venda
  const vendaCriada = await criarVenda(vendaForm);
  const vendaId = vendaCriada.id;

  // Cria itens
  await Promise.all(
    vendaForm.itens.map((item) =>
      criarVendaItem({
        venda_id: vendaId,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        preco_total: item.quantidade * item.preco_unitario,
      })
    )
  );

  // Cria pagamentos
  await Promise.all(
    (vendaForm.pagamentos || []).map((pag) =>
      criarPagamento({
        venda_id: vendaId,
        cliente_id: vendaForm.cliente_id || null,
        valor: pag.valor,
        forma_pagamento: pag.forma_pagamento as any,
        observacao: pag.observacao || null,
        data_pagamento: new Date().toISOString(),
      })
    )
  );

  // Cria contas a receber para pagamentos 'marcar_na_conta'
  const pagamentosConta = (vendaForm.pagamentos || []).filter(
    (p) => p.forma_pagamento === 'marcar_na_conta'
  );

  await Promise.all(
    pagamentosConta.map((pag) =>
      criarContaReceber({
        venda_id: vendaId,
        cliente_id: vendaForm.cliente_id || 0,
        valor: pag.valor,
        data_vencimento: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split('T')[0], // +7 dias para vencimento, formata YYYY-MM-DD
        data_pagamento: null,
      })
    )
  );

  return vendaCriada;
}
