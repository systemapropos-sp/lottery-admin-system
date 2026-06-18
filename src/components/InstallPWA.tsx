import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("nmv_pwa_dismissed")) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("nmv_pwa_dismissed", "1");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white border border-teal-500 rounded-xl shadow-xl px-5 py-3 flex items-center gap-3 max-w-sm w-[90vw]">
      <div className="flex-1">
        <p className="font-semibold text-slate-800 text-sm">Instalar NMV Admin</p>
        <p className="text-xs text-slate-500">Acceso rápido desde tu dispositivo</p>
      </div>
      <button
        onClick={handleInstall}
        className="flex items-center gap-1 bg-teal-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-600"
      >
        <Download size={14} />
        Instalar
      </button>
      <button onClick={handleDismiss} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
    </div>
  );
}
