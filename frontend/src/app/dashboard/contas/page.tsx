"use client";

import React, { useState, useEffect } from "react";
import { DataTableContaReceber } from "./_componentes/data-table-conta-receber";
import { pegarTodasContasReceber } from "@/api/contas_pendentes";
import { ContaReceberDetalhada } from "@/types/contas_detalhada";

function SkeletonConta() {
  return (
    <div className="w-full animate-pulse space-y-4">
      <div className="flex space-x-4 border-b border-gray-300 pb-2">
        <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
        <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
        <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
        <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
      </div>

      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4 py-2">
          <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
          <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
          <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
          <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default function ContasPageClient() {
  const [contasPendentes, setContasPendentes] = useState<
    ContaReceberDetalhada[] | null
  >(null);
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      const data = await pegarTodasContasReceber();

      if (isMounted) {
        setContasPendentes(data);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!contasPendentes) {
    return <SkeletonConta />;
  }
  // async function onPagamentoConcluido() {
  //   await pegarTodasContasReceber();
  // }
  return (
    <DataTableContaReceber
      data={contasPendentes}
    />
  );
}
