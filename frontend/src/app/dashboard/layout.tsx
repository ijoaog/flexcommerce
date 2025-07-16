"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ClipboardList,
  Boxes,
  Users,
  FileText,
  Menu as MenuIcon,
  LogOut,
  // Columns
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/custom/ThemeToggle";

interface TopBarProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

import { useRouter } from "next/navigation";

function TopBar({ onMenuClick, onLogout }: TopBarProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleChangePassword = () => {
    router.push("/dashboard/auth/change-password");
  };

  return (
    <header className="relative h-16 flex items-center px-4 sm:px-6 py-3 border-b border-border text-foreground bg-card">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="md:hidden text-muted-foreground hover:text-foreground"
        aria-label="Abrir menu"
      >
        <MenuIcon className="w-6 h-6" />
      </Button>

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:hidden">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-background shadow-md flex items-center justify-center">
          <Image
            src="/logo-flexcommerce.jpg"
            alt="Flexcommerce Logo"
            width={48}
            height={48}
            className="object-cover"
            draggable={false}
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <ThemeToggle />

        {user?.name && (
          <>
            <span className="hidden md:inline text-foreground font-semibold truncate max-w-xs sm:max-w-sm">
              {user.name}
            </span>

            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline"
              onClick={handleChangePassword}
            >
              Trocar Senha
            </Button>
          </>
        )}

        <Button
          variant="destructive"
          size="icon"
          onClick={onLogout}
          aria-label="Logout"
          className="flex items-center justify-center"
        >
          <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>
    </header>
  );
}

function Sidebar({
  user,
  pathname,
  onLinkClick,
  onLogout,
  onChangePassword,
}: {
  user?: { name?: string };
  pathname: string;
  onLinkClick: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
}) {
  const navLinks = [
    { href: "/dashboard", label: "Registro de Vendas", icon: ClipboardList },
    { href: "/dashboard/estoque", label: "Controle de Estoque", icon: Boxes },
    { href: "/dashboard/clientes", label: "Clientes", icon: Users },
    { href: "/dashboard/contas", label: "Contas Anotadas", icon: FileText },
    // { href: "/dashboard/resumo_financeiro", label: "Resumo Financeiro", icon: Columns },
  ];

  const isActiveLink = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <>
      <div className="flex flex-col justify-center items-center border-b border-border p-4 h-auto sm:h-40">
        <div className="logoAndName flex flex-col items-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-card shadow-md select-none">
            <Image
              src="/logo-flexcommerce.jpg"
              alt="Flexcommerce Logo"
              fill
              sizes="112px"
              className="object-contain"
              draggable={false}
            />
          </div>
          {user?.name && (
            <p className="mt-3 text-center text-base font-medium text-foreground flex md:hidden truncate max-w-[10rem] sm:max-w-xs">
              {user.name}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full max-w-xs md:hidden flex sm:max-w-sm mt-4"
            onClick={() => {
              onLinkClick();
              onChangePassword();
            }}
          >
            Trocar Senha
          </Button>
        </div>
      </div>

      <nav className="flex-1 px-3 sm:px-6 py-6 flex flex-col justify-center items-center space-y-3 w-full max-w-xs sm:max-w-sm">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-row gap-3 sm:gap-4 items-center justify-center text-xs sm:text-sm font-medium px-4 py-3 rounded-lg transition-colors text-center w-full max-w-xs sm:max-w-sm",
              isActiveLink(href)
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            onClick={onLinkClick}
            aria-current={isActiveLink(href) ? "page" : undefined}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="truncate">{label}</span>
          </Link>
        ))}

        {/* Botão Trocar Senha dentro da nav */}
      </nav>

      {/* Logout button para mobile */}
      <div className="p-4 w-full border-t md:hidden flex border-border">
        <Button
          variant="destructive"
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full font-semibold"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>

      <div className="p-4 text-xs text-muted-foreground text-center border-t border-border select-none">
        © 2025 Flexcommerce
      </div>
    </>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return null; // ou um spinner

  const handleChangePassword = () => {
    router.push("/dashboard/auth/change-password");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar fixa em md+ */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col h-full overflow-y-auto">
        <Sidebar
          user={user ?? undefined}
          pathname={pathname}
          onLinkClick={() => {}}
          onLogout={logout}
          onChangePassword={handleChangePassword}
        />
      </aside>

      {/* Sidebar Drawer para mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="p-0 w-full max-w-xs sm:max-w-sm overflow-y-auto"
        >
          <SheetHeader />
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <div className="h-full flex flex-col overflow-y-auto">
            <Sidebar
              user={user ?? undefined}
              pathname={pathname}
              onLinkClick={() => setOpen(false)}
              onLogout={logout}
              onChangePassword={() => {
                setOpen(false);
                handleChangePassword();
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          onMenuClick={() => setOpen(true)}
          onLogout={logout}
          // Opcional: remover botão trocar senha da topbar para evitar duplicação
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background w-max-4l">
          {children}
        </main>
      </div>
    </div>
  );
}
