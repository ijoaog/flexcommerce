"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";

import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Check,
  ChevronsUpDown,
  MoreVertical,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  getClientes,
  salvarCliente,
  excluirCliente,
  getClienteById,
} from "@/api/clientes";
import { Cliente, ClienteForm } from "@/types/cliente";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ClienteModal } from "./_componentes/adicionarClienteModal";
import { Skeleton } from "@/components/ui/skeleton";
export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal controle
  const [isDialogOpen, setIsDialogOpen] = useState(false); // formulário edição/novo
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // modal detalhes cliente

  // Estado do filtro: "todos" ou nome do cliente
  const [filtroCliente, setFiltroCliente] = useState<string>("todos");

  // Cliente selecionado no popover para ações
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );

  // Para confirmação de exclusão com AlertDialog
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(
    null
  );
  const [isExcluirDialogOpen, setIsExcluirDialogOpen] = useState(false);

  const abrirConfirmarExclusao = (cliente: Cliente) => {
    setClienteParaExcluir(cliente);
    setIsExcluirDialogOpen(true);
  };

  // Busca os clientes do backend
  const fetchClientes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao carregar clientes."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // Salva cliente (novo ou edição)
  const handleSalvar = async (dados: ClienteForm) => {
    setIsLoading(true);
    try {
      await salvarCliente(dados, editando?.id);

      toast.success(
        editando
          ? "Cliente atualizado com sucesso!"
          : "Cliente cadastrado com sucesso!"
      );

      setEditando(null);
      setIsDialogOpen(false);
      await fetchClientes();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar cliente.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir cliente - agora sem confirm(), só chama a exclusão direta
  const handleExcluirConfirmado = async () => {
    if (!clienteParaExcluir) return;
    setIsLoading(true);
    try {
      await excluirCliente(clienteParaExcluir.id);
      toast.success("Cliente excluído com sucesso!");
      await fetchClientes();
      setClienteSelecionado(null);
      setIsExcluirDialogOpen(false);
      setClienteParaExcluir(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir cliente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir formulário edição/novo
  const abrirFormulario = (cliente?: Cliente) => {
    if (cliente) {
      setEditando(cliente);
    } else {
      setEditando(null);
    }

    setIsDialogOpen(true);
  };

  // Abrir modal detalhes com dados atualizados do cliente via API
  const abrirDetalhes = async (cliente: Cliente) => {
    setIsLoading(true);
    try {
      const clienteAtualizado = await getClienteById(cliente.id);
      setClienteSelecionado(clienteAtualizado);
      setIsDetailsOpen(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao carregar detalhes."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Clientes filtrados por nome ou todos
  const clientesFiltrados =
    filtroCliente === "todos"
      ? clientes
      : clientes.filter((c) => c.nome === filtroCliente);

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Clientes</h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded="false"
                className="w-full sm:w-[220px] justify-between"
              >
                {filtroCliente === "todos" ? "Procurar Cliente" : filtroCliente}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full sm:w-[220px] p-0">
              <Command>
                <CommandInput
                  placeholder="Filtrar cliente..."
                  className="px-3 py-1 text-sm"
                />
                <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    key="todos"
                    onSelect={() => setFiltroCliente("todos")}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filtroCliente === "todos" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Todos os clientes
                  </CommandItem>
                  {Array.from(new Set(clientes.map((c) => c.nome))).map(
                    (nome) => (
                      <CommandItem
                        key={nome}
                        onSelect={() => setFiltroCliente(nome)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filtroCliente === nome ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {nome}
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Button onClick={() => abrirFormulario()} disabled={isLoading}>
            Adicionar Cliente
          </Button>

          <ClienteModal
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setEditando(null);
            }}
            onSave={handleSalvar}
            initialData={editando}
            isLoading={isLoading}
          />

          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-md sm:max-w-lg w-full">
              <DialogTitle>Detalhes do Cliente</DialogTitle>
              {clienteSelecionado && (
                <div className="mt-2 space-y-2">
                  <p>
                    <strong>Nome:</strong> {clienteSelecionado.nome}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {clienteSelecionado.telefone}
                  </p>
                  <p>
                    <strong>Email:</strong> {clienteSelecionado.email}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {clienteSelecionado.endereco}
                  </p>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setIsDetailsOpen(false)}>Fechar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden sm:table-cell">Endereço</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-24 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20 rounded" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-32 rounded" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-48 rounded" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {cliente.email}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {cliente.endereco}
                </TableCell>
                <TableCell className="text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        aria-label="Ações"
                        onClick={() => setClienteSelecionado(cliente)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[160px] p-0">
                      <Command>
                        <CommandGroup>
                          <CommandItem onSelect={() => abrirDetalhes(cliente)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </CommandItem>
                          <CommandItem
                            onSelect={() => abrirFormulario(cliente)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </CommandItem>
                          <CommandItem
                            onSelect={() => abrirConfirmarExclusao(cliente)}
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            Excluir
                          </CommandItem>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AlertDialog
        open={isExcluirDialogOpen}
        onOpenChange={setIsExcluirDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            {clienteParaExcluir ? (
              <p>
                Tem certeza que deseja excluir o cliente
                <strong>{clienteParaExcluir.nome}</strong>?
              </p>
            ) : (
              <p>Cliente não selecionado.</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsExcluirDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExcluirConfirmado}
              className="bg-red-400 hover:bg-red-500"
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
