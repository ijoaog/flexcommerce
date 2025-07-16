import { jwtVerify } from "jose";

export interface DecodedUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "sua_chave_secreta";

export async function verifyToken(token: string): Promise<DecodedUser> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    // Extração segura dos campos
    const { sub, email, name, role, iat, exp } = payload as any;

    if (!sub || !email || !role || !name) {
      throw new Error("Token malformado");
    }

    return {
      userId: sub,
      email,
      name,
      role,
      iat,
      exp,
    };
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    throw new Error("Token inválido ou expirado");
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem("token");
}

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}
