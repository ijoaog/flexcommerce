"use client";

import React from "react";

type QuantityInputProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: number) => void;
  placeholder?: string;
  className?: string; // adicionei aqui
};

export default function QuantityInput({
  value,
  min = 0,
  max = 9999,
  step = 1,
  onChange,
  placeholder,
  className = "", // desestruturei com valor padrão
}: QuantityInputProps) {
  const increment = () => {
    const newValue = Math.min(value + step, max);
    const event = {
      target: { value: newValue.toString() },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  const decrement = () => {
    const newValue = Math.max(value - step, min);
    const event = {
      target: { value: newValue.toString() },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className={`relative flex items-center max-w-[8rem] ${className}`}>
      <button
        type="button"
        onClick={decrement}
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-2 focus:outline-none"
      >
        <svg
          className="w-3 h-3 hover:text-gray-500 transition-colors"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        type="number"
        className="quantity-input bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        required
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={increment}
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-2 focus:outline-none"
      >
        <svg
          className="w-3 h-3 hover:text-gray-500 transition-colors"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>

      <style jsx>{`
        /* Chrome, Safari, Edge */
        .quantity-input::-webkit-inner-spin-button,
        .quantity-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        .quantity-input {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
