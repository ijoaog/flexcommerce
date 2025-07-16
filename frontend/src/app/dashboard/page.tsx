"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import QuantityInput from "@/components/custom/numberInputFormats";
import { ComboboxComFiltro } from "@/components/custom/ComboboxComFiltro";
import { Cliente, ClienteForm } from "@/types/cliente";
import { Produto } from "@/types/produto";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getClientes, salvarCliente } from "@/api/clientes";
import { getProdutos } from "@/api/produto";
import { salvarVenda } from "@/api/salvarVenda";
import { Label } from "@radix-ui/react-label";
import { ClienteModal } from "./clientes/_componentes/adicionarClienteModal";
import { toast } from "sonner";
import { FormatarParaReal } from "./estoque/_componentes/formatarMoedaBR";
import { PagamentoForm, tipos_pagamento } from "@/types/pagamento";
import { Input } from "@/components/ui/input";
import { FullPageLoading } from "@/components/custom/FullLoadingPage";
function formatarFormaPagamento(forma: string) {
  if (forma === "marcar_na_conta") return "Marcar na conta";
  return forma
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
export default function TelaVendas() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );
  const [itensVenda, setItensVenda] = useState<
    { produto: Produto; quantidade: number }[]
  >([]);
  const [formaPagamento, setFormaPagamento] =
    useState<tipos_pagamento>("dinheiro");
  const [pagamentoParcial, setPagamentoParcial] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [produtoSearch, setProdutoSearch] = useState("");
  const [clienteSearch, setClienteSearch] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagamentos, setPagamentos] = useState<
    Omit<PagamentoForm, "id" | "venda_id" | "cliente_id" | "data_pagamento">[]
  >([]);
  const clienteInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (formaPagamento === "marcar_na_conta" && !clienteSelecionado) {
      setTimeout(() => {
        clienteInputRef.current?.focus();
      }, 100); // pequeno delay pode ser necessário se for logo após render
    }
  }, [formaPagamento, clienteSelecionado]);
  // Carregar produtos com filtro de busca
  useEffect(() => {
    let ativo = true;
    getProdutos()
      .then((data) => {
        if (!ativo) return;
        const filtrados =
          produtoSearch.trim() === ""
            ? data
            : data.filter((p) =>
                p.nome.toLowerCase().includes(produtoSearch.toLowerCase())
              );
        setProdutos(filtrados);
      })
      .catch(() => ativo && setProdutos([]));
    return () => {
      ativo = false;
    };
  }, [produtoSearch]);

  // Carregar clientes com filtro de busca
  useEffect(() => {
    let ativo = true;
    getClientes()
      .then((data) => {
        if (!ativo) return;
        const filtrados =
          clienteSearch.trim() === ""
            ? data
            : data.filter((c) =>
                c.nome.toLowerCase().includes(clienteSearch.toLowerCase())
              );
        setClientes(filtrados);
      })
      .catch(() => ativo && setClientes([]));
    return () => {
      ativo = false;
    };
  }, [clienteSearch]);

  // Função para salvar cliente (novo ou edição)
  const handleSalvar = async (dados: ClienteForm) => {
    setIsLoading(true);
    try {
      await salvarCliente(dados, editando?.id);
      toast.success(
        editando
          ? "Cliente atualizado com sucesso!"
          : "Cliente cadastrado com sucesso!"
      );

      const novosClientes = await getClientes();
      setClientes(novosClientes);
      setEditando(null);
      setIsDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar cliente.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir formulário para editar ou criar cliente
  const abrirFormulario = (cliente?: Cliente) => {
    if (cliente) {
      setEditando(cliente);
    } else {
      setEditando(null);
    }

    setIsDialogOpen(true);
  };

  // Adicionar produto à venda
  const adicionarProduto = () => {
    if (!produtoSelecionado) return;
    setItensVenda((old) => {
      const existe = old.find(
        (item) => item.produto.id === produtoSelecionado.id
      );
      if (existe) {
        return old.map((item) =>
          item.produto.id === produtoSelecionado.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...old, { produto: produtoSelecionado, quantidade: 1 }];
    });
    setProdutoSelecionado(null);
    setProdutoSearch("");
  };

  // Remover item da venda
  const removerItem = (id: number) => {
    setItensVenda((old) => old.filter((item) => item.produto.id !== id));
  };

  // Alterar quantidade do produto na venda
  const alterarQuantidade = (id: number, qtd: number) => {
    if (qtd < 1) return;
    setItensVenda((old) =>
      old.map((item) =>
        item.produto.id === id ? { ...item, quantidade: qtd } : item
      )
    );
  };

  // Adicionar novo pagamento
  const adicionarPagamento = () => {
    setPagamentos((prev) => [
      ...prev,
      { valor: 0, forma_pagamento: "dinheiro", observacao: "" },
    ]);
  };

  // Atualizar pagamento em uma posição específica
  const atualizarPagamento = (
    index: number,
    updated: Omit<
      PagamentoForm,
      "id" | "venda_id" | "cliente_id" | "data_pagamento"
    >
  ) => {
    setPagamentos((prev) => {
      const newArr = [...prev];
      newArr[index] = updated;
      return newArr;
    });
  };

  // Remover pagamento da lista
  const removerPagamento = (index: number) => {
    setPagamentos((prev) => prev.filter((_, i) => i !== index));
  };

  // Total da venda calculado
  const total = itensVenda.reduce(
    (acc, item) => acc + (item.produto.preco_venda ?? 0) * item.quantidade,
    0
  );

  const valorMarcadoNaConta = pagamentos
    .filter((p) => p.forma_pagamento === "marcar_na_conta")
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

  const totalPago = pagamentos
    .filter((p) => p.forma_pagamento !== "marcar_na_conta")
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

  const saldoTotalPagoOuAnotado = totalPago + valorMarcadoNaConta;
  const saldoRealPendente = total - saldoTotalPagoOuAnotado;
  // Formas de pagamento disponíveis
  const formasPagamento: tipos_pagamento[] = [
    "dinheiro",
    "cartao",
    "pix",
    "marcar_na_conta",
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

  // Validação se pode finalizar a venda
  const podeFinalizar =
    itensVenda.length > 0 &&
    (formaPagamento !== "marcar_na_conta" || clienteSelecionado !== null) &&
    (formaPagamento !== "marcar_na_conta" || pagamentoParcial >= 0);

  // Função que finaliza a venda
  const finalizarVenda = async () => {
    if (!podeFinalizar) {
      alert("Preencha todos os dados corretamente.");
      return;
    }
    setIsLoading(true);

    try {
      const hojeStr = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
      const hoje = new Date(hojeStr);
      const daqui30dias = new Date(hoje);
      daqui30dias.setDate(hoje.getDate() + 30);

      const dadosDaVendaFinalizada = {
        cliente_id: clienteSelecionado?.id || null,
        itens: itensVenda.map((item) => ({
          produto_id: item.produto.id,
          quantidade: item.quantidade,
          preco_unitario: Number(item.produto.preco_venda) || 0,
        })),
        pagamentos: pagamentos.map((p) => ({
          forma_pagamento: p.forma_pagamento, // corrigido aqui
          valor: p.valor,
          cliente_id: clienteSelecionado?.id || null,
          data_pagamento: hojeStr,
          observacao: p.observacao || null,
        })),
        contasReceber: pagamentos
          .filter((p) => p.forma_pagamento === "marcar_na_conta")
          .map((p) => ({
            cliente_id: clienteSelecionado?.id || null,
            valor: p.valor,
            data_vencimento: daqui30dias,
            data_pagamento: null,
          })),
      };

      await salvarVenda(dadosDaVendaFinalizada);

      setResultMessage("Venda registrada com sucesso!");
      setIsError(false);
      setShowResultModal(true);

      // Resetar estados
      setItensVenda([]);
      setClienteSelecionado(null);
      setPagamentoParcial(0);
      setFormaPagamento("dinheiro");
      setPagamentos([]);
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);

      setResultMessage(
        "Erro ao finalizar venda. Por favor, anote a compra manualmente, pois não foi registrada."
      );
      setIsError(true);
      setShowResultModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Função ao clicar no botão finalizar
  const handleFinalizarClick = () => {
    const existeMarcadoNaConta = pagamentos.some(
      (p) => p.forma_pagamento === "marcar_na_conta"
    );

    // Permitir saldo pendente se ele foi exatamente anotado na conta
    const valorRealmentePendente = total - totalPago - valorMarcadoNaConta;

    if (valorRealmentePendente > 0) {
      toast.error(
        "O valor total da venda não foi totalmente distribuído nos pagamentos."
      );
      return;
    }

    if (!podeFinalizar) {
      alert("Preencha todos os dados corretamente.");
      return;
    }

    if (existeMarcadoNaConta) {
      setShowConfirmModal(true);
    } else {
      finalizarVenda();
    }
  };

  const alertaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clienteSelecionado === null && formaPagamento === "marcar_na_conta") {
      setTimeout(() => {
        alertaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  }, [clienteSelecionado, formaPagamento]);
  return (
    <main className="w-full p-6 space-y-10 max-w-4xl mx-auto">
      {isLoading && <FullPageLoading />}

      <h1 className="text-4xl font-bold text-center mb-10">Registrar Venda</h1>
      {/* Adicionar Produto */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Produto</CardTitle>
          <CardDescription>
            Busque e selecione um produto para adicionar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <ComboboxComFiltro<Produto>
                items={produtos}
                value={produtoSelecionado}
                onValueChange={setProdutoSelecionado}
                onInputChange={setProdutoSearch}
                itemToString={(item) => item?.nome || ""}
                placeholder="Buscar produto..."
                renderItem={(item) => (
                  <div className="flex justify-between w-full">
                    <span>{item.nome}</span>
                    <span>R$ {item.preco_venda}</span>
                  </div>
                )}
              />
            </div>
            <Button
              onClick={adicionarProduto}
              disabled={!produtoSelecionado}
              variant="default"
              aria-label="Adicionar produto ao carrinho"
              className="whitespace-nowrap"
            >
              Colocar no carrinho
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Carrinho */}
      <Card>
        <CardHeader>
          <CardTitle>Carrinho</CardTitle>
          <CardDescription>
            Confira e ajuste os produtos adicionados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {itensVenda.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum produto adicionado.
            </p>
          ) : (
            <ul className="space-y-4">
              {itensVenda.map(({ produto, quantidade }) => (
                <li
                  key={produto.id}
                  className="flex flex-col md:flex-row items-center md:items-start justify-between p-4 border rounded"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold truncate">{produto.nome}</h3>
                    <p className="text-sm text-gray-700">
                      Preço: R$ {produto.preco_venda}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <QuantityInput
                      value={quantidade}
                      min={1}
                      step={1}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 1) alterarQuantidade(produto.id, val);
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removerItem(produto.id)}
                      aria-label={`Remover ${produto.nome} do carrinho`}
                    >
                      Remover
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      {/* Selecionar Cliente */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle>Selecionar Cliente</CardTitle>
            <CardDescription>
              Busque e selecione um cliente para a venda
            </CardDescription>
          </div>
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
        </CardHeader>
        <CardContent>
          <ComboboxComFiltro<Cliente>
            items={clientes}
            value={clienteSelecionado}
            onValueChange={setClienteSelecionado}
            onInputChange={setClienteSearch}
            itemToString={(item) => item?.nome || ""}
            placeholder="Buscar cliente..."
            inputRef={clienteInputRef} // <- aqui
            renderItem={(item) => <div>{item.nome}</div>}
          />
          {clienteSelecionado === null &&
            formaPagamento === "marcar_na_conta" && (
              <div
                ref={alertaRef}
                className="bg-red-100 border mt-3 border-red-400 text-red-700 px-4 py-3 rounded text-center max-w-md"
              >
                <p className="font-semibold">Cliente obrigatório!</p>
                <p>Você deve selecionar um cliente ao marcar na conta.</p>
              </div>
            )}
        </CardContent>
      </Card>
      {/* Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos</CardTitle>
          <CardDescription>Informe as formas de pagamento</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {pagamentos.map((pagamento, idx) => {
            const isConta = pagamento.forma_pagamento === "marcar_na_conta"; // ajuste conforme seu valor real

            return (
              <fieldset
                key={idx}
                className="border rounded p-5"
                aria-describedby={`desc-pagamento-${idx}`}
              >
                <legend className="text-lg font-semibold mb-5">
                  Pagamento {idx + 1}
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Forma de Pagamento */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`forma-pagamento-${idx}`}>
                      Forma de Pagamento
                    </Label>
                    <Select
                      value={pagamento.forma_pagamento}
                      onValueChange={(value) => {
                        atualizarPagamento(idx, {
                          ...pagamento,
                          forma_pagamento: value as tipos_pagamento,
                        });
                        setFormaPagamento(value as tipos_pagamento);
                      }}
                    >
                      <SelectTrigger id={`forma-pagamento-${idx}`}>
                        <SelectValue placeholder="Selecione a forma" />
                      </SelectTrigger>
                      <SelectContent>
                        {formasPagamento.map((forma) => (
                          <SelectItem key={forma} value={forma}>
                            {formatarFormaPagamento(forma)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Valor */}
                  <div className="flex flex-col gap-2 relative">
                    <Label htmlFor={`valor-pagamento-${idx}`}>Valor (R$)</Label>
                    <FormatarParaReal
                      value={pagamento.valor}
                      onChange={(value) => {
                        atualizarPagamento(idx, {
                          ...pagamento,
                          valor: Number(value),
                        });
                        setFormaPagamento(pagamento.forma_pagamento);
                      }}
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors ${
                        isConta
                          ? "border-yellow-400 bg-yellow-50 focus-visible:ring-yellow-400"
                          : ""
                      }`}
                    />
                    {isConta && (
                      <span className="text-sm text-yellow-600 mt-1">
                        Este valor será anotado na conta do cliente.
                      </span>
                    )}
                  </div>

                  {/* Botão remover */}
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removerPagamento(idx)}
                      aria-label={`Remover pagamento ${idx + 1}`}
                      className="w-full sm:w-auto"
                    >
                      Remover
                    </Button>
                  </div>
                </div>

                {/* Observação */}
                <div className="mt-5">
                  <Label htmlFor={`obs-pagamento-${idx}`}>
                    Observação (opcional)
                  </Label>
                  <Input
                    id={`obs-pagamento-${idx}`}
                    value={pagamento.observacao ?? ""}
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
            disabled={isLoading}
          >
            Adicionar pagamento
          </Button>
        </CardContent>
      </Card>
      {/* Resumo e Finalização */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Venda</CardTitle>
          <CardDescription className="space-y-1">
            <p>
              Total da venda: <strong>R$ {total}</strong>
            </p>
            <p>
              Valor pago: <strong>R$ {totalPago}</strong>
            </p>
            <p>
              Valor marcado na conta:{" "}
              <strong className="text-yellow-600">
                R$ {valorMarcadoNaConta}
              </strong>
            </p>
            <p>
              Saldo pendente total:{" "}
              <strong
                className={
                  saldoRealPendente > 0 ? "text-red-600" : "text-green-600"
                }
              >
                R$ {saldoRealPendente}
              </strong>
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button
            onClick={handleFinalizarClick}
            disabled={!podeFinalizar || isLoading}
            variant="default"
            aria-label="Finalizar venda"
          >
            Finalizar Venda
          </Button>
        </CardContent>
      </Card>
      {/* Confirmar Venda - Modal */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Venda</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Você tem certeza que deseja marcar esta venda na conta do
                cliente:
              </p>

              <p className="text-xl font-bold text-primary">
                {clienteSelecionado?.nome}
              </p>

              <p>Valor pago diretamente:</p>
              <p className="text-lg font-semibold text-green-600">
                R$ {totalPago}
              </p>

              <p>Valor a ser marcado na conta:</p>
              <p className="text-2xl font-semibold text-yellow-600">
                R$ {valorMarcadoNaConta}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={finalizarVenda} disabled={isLoading}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Resultado da Venda - Modal */}
      <AlertDialog open={showResultModal} onOpenChange={setShowResultModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={isError ? "text-red-600 font-bold" : "text-gray-900"}
            >
              {isError ? "Erro" : "Sucesso"}
            </AlertDialogTitle>
            <AlertDialogDescription
              className={isError ? "text-red-500" : "text-gray-700"}
            >
              {resultMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowResultModal(false)}>
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
