export interface Cliente {
  id: number;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  data_criacao: string;
  atualizado_em: string;
  deletado_em?: string | null;
}

export interface ClienteForm {
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
}
