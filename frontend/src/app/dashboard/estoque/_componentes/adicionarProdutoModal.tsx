"use client";
import QuantityInput from "@/components/custom/numberInputFormats";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useCallback} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormatarParaReal } from "./formatarMoedaBR";
import { Produto, ProdutoForm } from "@/types/produto";
import { salvarProduto } from "@/api/produto";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // supondo que você tenha algo assim
import { getProdutos } from "@/api/produto";
import { ComboboxComFiltro } from "@/components/custom/ComboboxComFiltro";
const responsavelProdutoEnum = z.enum(["", "ana", "patricia"]);
function FieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Skeleton className="h-5 w-1/3 mb-2 rounded" /> {/* Label */}
      <Skeleton className="h-10 w-full rounded" /> {/* Input */}
    </div>
  );
}
const produtoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  quantidade: z.number(),
  responsavel_produto: responsavelProdutoEnum.optional(),
  descricao: z.string().optional(),
  categoria_id: z.number().optional(),
  modelo: z.string().optional(),
  marca: z.string().optional(),
  codigo_barras: z.string().optional(),
  preco_venda: z.coerce.number().optional(),
  preco_custo: z.coerce.number().optional(),
  unidade_medida: z.string().optional(),
  peso: z.coerce.number().optional(),
  cor: z.string().optional(),
  tamanho: z.string().optional(),
  material: z.string().optional(),
  situacao: z.enum(["ativo", "inativo", "descontinuado"]).optional(),
  garantia_meses: z.coerce.number().optional(),
  fornecedor: z.string().optional(),
  observacoes: z.string().optional(),
});

type Categoria = {
  id: number;
  nome: string;
  descricao?: string;
};

export function ProdutoModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isVisualizacao = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (saved: boolean) => void;
  initialData?: Produto | null;
  isVisualizacao?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [openConfirmClose, setOpenConfirmClose] = useState(false);

  const form = useForm<ProdutoForm>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: "",
      quantidade: 0,
      responsavel_produto: "",
      descricao: "",
      categoria_id: undefined,
      modelo: "",
      marca: "",
      codigo_barras: "",
      preco_venda: undefined,
      preco_custo: undefined,
      unidade_medida: "",
      peso: undefined,
      cor: "",
      tamanho: "",
      material: "",
      situacao: "ativo",
      garantia_meses: undefined,
      fornecedor: "",
      observacoes: "",
    },
  });

  const { reset, handleSubmit, formState } = form;
  const { isDirty } = formState;
  const isEdicao = Boolean(initialData && !isVisualizacao);

  const fetchCategorias = useCallback(async () => {
    setLoadingCategorias(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categorias`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      const data: Categoria[] = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error(error);
      setCategorias([]);
    } finally {
      setLoadingCategorias(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      (async () => {
        setIsLoading(true); // <-- aqui começa o loading geral
        try {
          await fetchCategorias(); // primeiro carrega categorias
          if (initialData) {
            reset({
              nome: initialData.nome ?? "",
              responsavel_produto: initialData.responsavel_produto ?? "",
              quantidade: initialData.quantidade ?? 0,
              descricao: initialData.descricao ?? "",
              categoria_id: initialData.categoria?.id ?? undefined,
              modelo: initialData.modelo ?? "",
              marca: initialData.marca ?? "",
              codigo_barras: initialData.codigo_barras ?? "",
              preco_venda: initialData.preco_venda,
              preco_custo: initialData.preco_custo,
              unidade_medida: initialData.unidade_medida ?? "",
              peso: initialData.peso,
              cor: initialData.cor ?? "",
              tamanho: initialData.tamanho ?? "",
              material: initialData.material ?? "",
              situacao: initialData.situacao ?? "ativo",
              garantia_meses: initialData.garantia_meses,
              fornecedor: initialData.fornecedor ?? "",
              observacoes: initialData.observacoes ?? "",
            });
          } else {
            reset();
          }
        } finally {
          setIsLoading(false); // <-- finaliza o loading geral
        }
      })();
    }
  }, [isOpen, fetchCategorias, initialData, reset]);

  const onSubmit = async (data: ProdutoForm) => {
    if (isVisualizacao) return;
    try {
      setIsLoading(true);
      await salvarProduto(data, initialData?.id);

      toast.success(
        initialData
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!"
      );

      if (onSave) onSave(true);
      getProdutos();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar produto");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoriaField = useCallback(() => {
    const categoriaValue = form.watch("categoria_id");

    if (loadingCategorias) {
      return (
        <div className="text-sm text-muted-foreground">
          Carregando categorias...
        </div>
      );
    }

    return (
      <FormField
        control={form.control}
        name="categoria_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <ComboboxComFiltro<Categoria>
              items={categorias}
              value={
                categoriaValue !== undefined && categoriaValue !== null
                  ? categorias.find((cat) => cat.id === categoriaValue) || null
                  : null
              }
              onValueChange={(selected) => {
                field.onChange(selected?.id ?? undefined);
              }}
              itemToString={(item) => item?.nome || ""}
              placeholder="Selecione uma categoria"
              renderItem={(item) => <div>{item.nome}</div>}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }, [form, categorias, loadingCategorias]);

  // Função para fechar modal com verificação de alterações
  const handleClose = () => {
    if (isVisualizacao) {
      onClose();
      setOpenConfirmClose(false); // garante que o modal fecha/reset
      return;
    }
    if (isDirty) {
      setOpenConfirmClose(true);
    } else {
      if (onSave) onSave(false);
      onClose();
      setOpenConfirmClose(false);
    }
  };

  // Confirmar fechamento sem salvar
  const confirmCloseWithoutSave = () => {
    setOpenConfirmClose(false);
    if (onSave) onSave(false);
    onClose();
    form.reset(); // opcional, para resetar o formulário
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-3xl w-full h-[78%] overflow-y-auto">
          <DialogTitle>
            {isVisualizacao
              ? "Visualizar Produto"
              : isEdicao
              ? "Editar Produto"
              : "Novo Produto"}
          </DialogTitle>

          {isLoading ? (
            <div className="flex flex-wrap gap-4">
              {/* Skeleton Nome */}
              <FieldSkeleton className="w-full sm:w-1/2 max-w-[320px]" />
              {/* Skeleton Quantidade */}
              <FieldSkeleton className="w-full sm:w-1/2 max-w-[320px]" />
              {/* Skeleton Descrição */}
              <FieldSkeleton className="w-full sm:w-1/2 max-w-[320px]" />
              {/* Skeleton Categoria - pode ser um skeleton mais largo */}
              <Skeleton className="w-full max-w-[650px] h-[56px] rounded" />
              {/* Skeleton Responsável pelo Produto */}
              <FieldSkeleton className="w-full sm:w-1/2 max-w-[320px]" />
              {/* Skeleton para Preço Venda, Preço Custo, Peso, Garantia */}
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-1/2 sm:w-1/4 max-w-[140px] h-12 rounded"
                />
              ))}
              {/* Skeleton para Modelo, Marca, Unidade Medida, Cor, etc */}
              {[...Array(7)].map((_, i) => (
                <FieldSkeleton
                  key={i}
                  className="w-full sm:w-1/2 max-w-[320px]"
                />
              ))}
              {/* Skeleton Situação */}
              <FieldSkeleton className="w-full sm:w-1/2 max-w-[320px]" />
              {/* Skeleton Observações */}
              <Skeleton className="w-full max-w-[650px] h-[80px] rounded" />
              {/* Skeleton botões */}
              <div className="flex justify-end gap-4 pt-6 w-full">
                <Skeleton className="h-10 w-[100px] rounded" />
                <Skeleton className="h-10 w-[100px] rounded" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  {/* Nome */}
                  <div className="w-full sm:w-1/2 max-w-[320px]">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isVisualizacao}
                              placeholder="Nome do produto"
                              className="w-full"
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* quantidade */}
                  <div className="w-full sm:w-1/2 max-w-[320px]">
                    <FormField
                      control={form.control}
                      name="quantidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <QuantityInput
                              value={Number(field.value) || 0}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(
                                  val === "" ? undefined : Number(val)
                                );
                              }}
                              min={1}
                              max={9999}
                              step={1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Descrição */}
                  <div className="w-full sm:w-1/2 max-w-[320px]">
                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isVisualizacao}
                              placeholder="Descrição do produto"
                              className="w-full"
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Categoria */}
                  <div className="w-full max-w-[650px]">
                    {renderCategoriaField()}
                  </div>
                  <div className="w-full sm:w-1/2 max-w-[320px]">
                    <FormField
                      control={form.control}
                      name="responsavel_produto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsável pelo Produto</FormLabel>
                          <Select
                            disabled={isLoading || isVisualizacao}
                            onValueChange={(value) =>
                              // converte "nenhum" para "" para salvar no form
                              field.onChange(value === "nenhum" ? "" : value)
                            }
                            // converte "" para "nenhum" para exibir no Select
                            value={
                              field.value === "" ? "nenhum" : field.value ?? ""
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o responsável" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Mantém "" no enum, mas no SelectItem usa value "nenhum" */}
                              <SelectItem key="nenhum" value="nenhum">
                                Nenhum
                              </SelectItem>
                              {responsavelProdutoEnum.options
                                .filter((option) => option !== "")
                                .map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Preço Venda, Preço Custo, Peso, Garantia */}
                  {[
                    { name: "preco_venda", label: "Preço Venda" },
                    { name: "preco_custo", label: "Preço Custo" },
                    { name: "peso", label: "Peso (Kg)" },
                    { name: "garantia_meses", label: "Garantia (meses)" },
                  ].map(({ name, label }) => (
                    <div key={name} className="w-1/2 sm:w-1/4 max-w-[140px]">
                      <FormField
                        control={form.control}
                        name={name as keyof ProdutoForm}
                        render={({ field }) => {
                          const isPriceField =
                            name === "preco_venda" || name === "preco_custo";

                          return (
                            <FormItem>
                              <FormLabel>{label}</FormLabel>
                              <FormControl>
                                {isPriceField ? (
                                  <FormatarParaReal
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isLoading || isVisualizacao}
                                    placeholder={label}
                                    className="w-full"
                                  />
                                ) : (
                                  <QuantityInput
                                    value={Number(field.value) || 0}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      field.onChange(
                                        val === "" ? undefined : Number(val)
                                      );
                                    }}
                                    min={0}
                                    max={9999}
                                    step={1}
                                  />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  ))}

                  {/* Modelo, Marca, Unidade Medida, Cor, Tamanho, Material, Fornecedor */}
                  {[
                    { name: "modelo", label: "Modelo" },
                    { name: "marca", label: "Marca" },
                    { name: "unidade_medida", label: "Unidade de Medida" },
                    { name: "cor", label: "Cor" },
                    { name: "tamanho", label: "Tamanho" },
                    { name: "material", label: "Material" },
                    { name: "fornecedor", label: "Fornecedor" },
                  ].map(({ name, label }) => (
                    <div key={name} className="w-full sm:w-1/2 max-w-[320px]">
                      <FormField
                        control={form.control}
                        name={name as keyof ProdutoForm}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isLoading || isVisualizacao}
                                placeholder={label}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  {/* Situação */}
                  <div className="w-full sm:w-1/2 max-w-[320px]">
                    <FormField
                      control={form.control}
                      name="situacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situação</FormLabel>
                          <Select
                            disabled={isLoading || isVisualizacao}
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value ?? "ativo"}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione a situação" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="inativo">Inativo</SelectItem>
                              <SelectItem value="descontinuado">
                                Descontinuado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* Observações */}
                <div className="w-full max-w-[650px]">
                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            disabled={isLoading || isVisualizacao}
                            placeholder="Observações"
                            className="w-full rounded-md border border-gray-300 p-2 text-sm resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Botões */}
                {!isVisualizacao && (
                  <div className="flex justify-end gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação para fechar sem salvar */}
      <AlertDialog
        open={openConfirmClose}
        onOpenChange={(open) => setOpenConfirmClose(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja sair sem salvar?
            </AlertDialogTitle>
            <AlertDialogDescription>
              As alterações serão perdidas se você sair agora.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenConfirmClose(false)}>
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-400 hover:bg-red-500"
              onClick={confirmCloseWithoutSave}
            >
              Sair sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
