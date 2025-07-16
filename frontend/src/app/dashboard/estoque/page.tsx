"use client";

import { useEffect, useState } from "react";
import { ProdutoModal } from "./_componentes/adicionarProdutoModal";
import { TabelaProdutos } from "./_componentes/tabelaProduto";
import { Button } from "@/components/ui/button";
import { TabelaSkeleton } from "@/components/custom/TableSkeleton";
import { Produto } from "@/types/produto";
import { ComboboxComFiltro } from "@/components/custom/ComboboxComFiltro";

export default function EstoquePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [produtoSearch, setProdutoSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchProdutos() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/produtos`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data: Produto[] = await res.json();
      setProdutos(data);
      setFilteredProdutos(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Atualiza filtro quando o texto de busca muda
  useEffect(() => {
    if (produtoSearch.trim() === "") {
      setFilteredProdutos(produtos);
    } else {
      const searchLower = produtoSearch.toLowerCase();
      setFilteredProdutos(
        produtos.filter((p) => p.nome.toLowerCase().includes(searchLower))
      );
    }
  }, [produtoSearch, produtos]);

  // Atualiza produtos filtrados e seleciona o produto no filtro
  function handleSelectProduto(produto: Produto | null) {
    setSelectedProduto(produto);
    if (produto) {
      setFilteredProdutos([produto]);
    } else {
      setFilteredProdutos(produtos);
    }
  }

  const handleCloseModal = (shouldReload = false) => {
    setIsModalOpen(false);
    if (shouldReload) fetchProdutos();
  };

  return (
    <main className="w-full">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
      </header>
      <div className="comboboxeadiciona flex flex-row gap-6">
        <div className="mb-4 w-50 md:w-90">
          <ComboboxComFiltro<Produto>
            items={filteredProdutos}
            value={selectedProduto}
            onValueChange={handleSelectProduto}
            onInputChange={setProdutoSearch}
            itemToString={(item) => item?.nome || ""}
            placeholder="Buscar produto..."
            renderItem={(item) =>
              item ? item.nome : "Nenhum produto encontrado"
            }
          />
        </div>

        <Button onClick={() => setIsModalOpen(true)} disabled={loading}>
          Adicionar Produto
        </Button>
      </div>
      <ProdutoModal
        isOpen={isModalOpen}
        onClose={() => handleCloseModal(false)}
        onSave={() => handleCloseModal(true)}
      />
      {loading ? (
        <TabelaSkeleton />
      ) : (
        <TabelaProdutos produtos={filteredProdutos} onUpdate={fetchProdutos} />
      )}
    </main>
  );
}
