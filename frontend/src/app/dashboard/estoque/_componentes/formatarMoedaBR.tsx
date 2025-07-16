import { Input } from "@/components/ui/input";
import React from "react";

interface MoneyInputProps {
  value?: number; // valor em reais (ex: 12.34)
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function FormatarParaReal({
  value,
  onChange,
  disabled,
  placeholder,
  className,
}: MoneyInputProps) {
  // Converte o valor em reais para centavos inteiros
  const cents =
    value !== undefined && !isNaN(value) ? Math.round(value * 100) : 0;

  // Formata centavos para string no formato R$ 0,00
  const formatCentsToReal = (val: number) => {
    const reais = val / 100;
    return reais.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  };

  const displayValue = value !== undefined ? formatCentsToReal(cents) : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não for número
    const onlyDigits = e.target.value.replace(/\D/g, "");

    if (!onlyDigits) {
      onChange(undefined);
      return;
    }

    const centsNum = parseInt(onlyDigits, 10);
    onChange(centsNum / 100);
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      inputMode="numeric"
    />
  );
}
