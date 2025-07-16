"use client";
import { Produto } from "@/types/produto";
import React, { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { ProdutoModal } from "./adicionarProdutoModal";
import { excluirProduto } from "@/api/produto";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

interface TabelaProdutosProps {
  produtos: Produto[];
  onUpdate: any;
}

export function TabelaProdutos({ produtos, onUpdate }: TabelaProdutosProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [produtoExcluindo, setProdutoExcluindo] = useState<Produto | null>(
    null
  );

  const handleCloseModal = (shouldReload: boolean) => {
    setIsModalOpen(false);
    setProdutoEditando(null);
    if (shouldReload) {
      onUpdate();
    }
  };

  const handleEditClick = (produto: Produto) => {
    setProdutoEditando(produto);
    setIsModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!produtoExcluindo) return;
    try {
      await excluirProduto(produtoExcluindo.id);
      setProdutoExcluindo(null);
      onUpdate();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      // aqui você pode exibir um toast se quiser
    }
  };
  const columns: ColumnDef<Produto>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "categoria",
      header: "Categoria",
      cell: (info) =>
        info.getValue() ? (info.getValue() as Categoria).nome : "-",
    },
    {
      accessorKey: "preco_venda",
      header: "Preço Venda",
      cell: (info) => {
        const val = info.getValue() as number | undefined;
        return (
          val?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || "-"
        );
      },
    },
    {
      accessorKey: "preco_custo",
      header: "Preço Custo",
      cell: (info) => {
        const val = info.getValue() as number | undefined;
        return (
          val?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || "-"
        );
      },
    },
    {
      accessorKey: "situacao",
      header: "Situação",
      cell: (info) => info.getValue(),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const produto = row.original;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0.5">
                <MoreHorizontal size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-28 p-0">
              <div className="flex flex-col divide-y border rounded-md">
                <Button
                  variant="ghost"
                  onClick={() => handleEditClick(produto)}
                  className="py-1 px-2 text-sm"
                >
                  <Edit2 size={14} className="mr-1" /> Editar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setProdutoExcluindo(produto)}
                  className="py-1 px-2 text-sm"
                >
                  <Trash2 size={14} className="mr-1" /> Excluir
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        );
      },
    },
  ];

  const table = useReactTable({
    data: produtos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full mx-auto px-2">
      <h2 className="text-xl font-bold mb-2">Produtos Registrados</h2>
      <div className="overflow-x-auto rounded-md border">
        <Table className="w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-8">
                {headerGroup.headers.map((header) => {
                  const className =
                    header.id === "id" ||
                    header.id === "preco_custo" ||
                    header.id === "situacao"
                      ? "hidden md:table-cell"
                      : "";

                  return (
                    <TableHead
                      key={header.id}
                      className={`${className} px-2 py-1 text-left`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="h-8">
                {row.getVisibleCells().map((cell) => {
                  const className =
                    cell.column.id === "id" ||
                    cell.column.id === "preco_custo" ||
                    cell.column.id === "situacao"
                      ? "hidden md:table-cell"
                      : "";

                  return (
                    <TableCell
                      key={cell.id}
                      className={`${className} px-2 py-1 whitespace-nowrap`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ProdutoModal
        isOpen={isModalOpen}
        onClose={() => handleCloseModal(false)}
        onSave={() => handleCloseModal(true)}
        initialData={produtoEditando}
      />
      <AlertDialog
        open={!!produtoExcluindo}
        onOpenChange={(open) => !open && setProdutoExcluindo(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso removerá permanentemente o
              produto <strong>{produtoExcluindo?.nome}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProdutoExcluindo(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-400 hover:bg-red-500"
              onClick={confirmarExclusao}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
