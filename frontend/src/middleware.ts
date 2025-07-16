import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("public_token")?.value;
  const { pathname } = request.nextUrl;

  // Se o usuário está logado e tenta acessar exatamente "/login", redireciona para dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se não está logado e tenta acessar alguma rota que começa com /dashboard, redireciona para login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Para tudo mais, deixa passar normalmente (inclusive rotas públicas diferentes)
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
