export type SituacaoProduto = "ativo" | "inativo" | "descontinuado";
export type ResponsavelProduto = "" |"ana" | "patricia";
export interface Produto {
  id: number;
  quantidade: number;
  responsavel_produto?: ResponsavelProduto;
  nome: string;
  descricao?: string;
  categoria_id?: number;
  categoria?: any;
  modelo?: string;
  marca?: string;
  codigo_barras?: string;
  preco_venda?: number;
  preco_custo?: number;
  unidade_medida?: string;
  peso?: number;
  cor?: string;
  tamanho?: string;
  material?: string;
  situacao?: SituacaoProduto;
  garantia_meses?: number;
  fornecedor?: string;
  observacoes?: string;
}

export type ProdutoForm = Omit<Produto, "id">;
