"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Cliente, ClienteForm } from "@/types/cliente";

// Schema de validação
const clienteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
});

export function ClienteModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: ClienteForm) => Promise<void>;
  initialData?: Cliente | null;
  isLoading: boolean;
}) {
  const form = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
    },
  });

  const { reset, handleSubmit } = form;

  const isEdicao = Boolean(initialData);

  useEffect(() => {
    reset({
      nome: initialData?.nome ?? "",
      telefone: initialData?.telefone ?? "",
      email: initialData?.email ?? "",
      endereco: initialData?.endereco ?? "",
    });
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: ClienteForm) => {
    await onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg w-full">
        <DialogTitle>{isEdicao ? "Atualizar Cliente" : "Cadastrar Cliente"}</DialogTitle>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {["nome", "telefone", "email", "endereco"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof ClienteForm}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={fieldName}
                        {...field}
                        disabled={isLoading}
                        type={fieldName === "email" ? "email" : "text"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEdicao
                    ? "Atualizando..."
                    : "Salvando..."
                  : isEdicao
                  ? "Atualizar"
                  : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}