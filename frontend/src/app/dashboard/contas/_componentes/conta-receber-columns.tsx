"use client";
// components/conta-receber-columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContaReceberDetalhada } from "@/types/contas_detalhada";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Modal from "./PagarContaModal";
import VisualizarContaModal from "./VisualizarContaModal";

// Novo componente para a célula de ações
const AcoesCell: React.FC<{ row: any }> = ({ row }) => {
  const [open, setOpen] = React.useState(false);
  const [openVisualizar, setOpenVisualizar] = React.useState(false);
  const handlePagamentoConcluido = () => {
    setOpen(false);
    // Aqui você pode chamar uma função para recarregar dados, se necessário
  };

  if (row.getCanExpand()) {
    return row.getIsExpanded() ? (
      <div className="group flex justify-center items-center gap-2">
        <ChevronDown className="h-10 w-10 rounded-[var(--radius)] border border-border bg-popover text-popover-foreground transition-colors transition-bg transition-border group-hover:bg-accent group-hover:border-accent group-hover:text-accent-foreground" />
      </div>
    ) : (
      <div className="group flex justify-center items-center gap-2">
        <ChevronRight className="h-10 w-10 rounded-[var(--radius)] border border-border bg-popover text-popover-foreground transition-colors transition-bg transition-border group-hover:bg-accent group-hover:border-accent group-hover:text-accent-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="group flex justify-center items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Ações <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-full text-center">
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Pagar Conta
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenVisualizar(true)}>
              Visualizar Conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          contaId={String(row.original.id)}
          valorTotal={row.original.valor}
          onPagamentoConcluido={handlePagamentoConcluido}
        />

        <VisualizarContaModal
          isOpen={openVisualizar}
          onClose={() => setOpenVisualizar(false)}
          conta={row.original}
        />
      </div>
    </>
  );
};

// Colunas
export const contaReceberColumns: ColumnDef<ContaReceberDetalhada>[] = [
  {
    accessorKey: "cliente_id",
    header: () => <span className="hidden sm:table-cell">Cliente ID</span>,
    cell: ({ row }) => (
      <span className="hidden sm:table-cell">{row.getValue("cliente_id")}</span>
    ),
  },
  {
    id: "cliente_nome",
    accessorFn: (row) => row.cliente.nome,
    header: "Nome", // MANTER VISÍVEL
    enableGrouping: true,
    enableSorting: true,
    filterFn: "includesString",
    cell: ({ row }) =>
      row.getIsGrouped() ? (
        <span>{row.original.cliente.nome}</span>
      ) : (
        <span>{row.original.cliente.nome}</span>
      ),
  },
  {
    id: "venda_data_venda",
    accessorFn: (row) => row.venda.data_venda,
    header: ({ column }) => (
      <span className="hidden sm:inline-flex">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data da Venda <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </span>
    ),
    cell: ({ row }) => (
      <span className="hidden sm:table-cell">
        {new Date(row.original.venda.data_venda).toLocaleDateString("pt-BR")}
      </span>
    ),
  },
  {
    accessorKey: "valor",
    header: "Valor", // MANTER VISÍVEL
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const total = row
          .getLeafRows()
          .reduce((sum, leafRow) => sum + Number(leafRow.original.valor), 0);
        return total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }

      const valorNum = Number(row.original.valor);
      return valorNum.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  {
    id: "status",
    accessorFn: (row) => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataVencimento = new Date(row.data_vencimento);
      return dataVencimento < hoje ? "Vencida" : "Pendente";
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataVencimento = new Date(row.original.data_vencimento);

      if (dataVencimento < hoje) {
        return <span className="text-red-600 font-semibold">Vencida</span>;
      }

      return (
        <span className="flex items-center gap-2 text-yellow-500 font-semibold">
          <span
            className="inline-block h-3 w-3 rounded-full bg-yellow-400"
            aria-hidden="true"
          />
          Pendente
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Ações", // MANTER VISÍVEL
    cell: ({ row }) => <AcoesCell row={row} />,
  },
];
