import { z } from 'zod';

// Definindo o schema de validação com Zod
export const loginSchema = z.object({
  email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").nonempty("Senha é obrigatória"),
});

// Tipo para os dados do formulário
export type LoginFormData = z.infer<typeof loginSchema>;