// components/FullPageLoading.tsx
import { Loader2 } from "lucide-react";

import { createPortal } from "react-dom";

export function FullPageLoading() {
  if (typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-card/20 backdrop-blur-sm">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>,
    document.body
  );
}
