import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

interface StubPageProps {
  title: string;
}

export default function StubPage({ title }: StubPageProps) {
  return (
    <div>
      <PageHeader title={title} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-xl border border-[#E5E5E0] p-12 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center"
      >
        <div className="w-16 h-16 rounded-full bg-[#E0F7F5] flex items-center justify-center mb-4">
          <Construction size={28} className="text-[#4ECDC4]" />
        </div>
        <h2 className="text-lg font-semibold text-[#333333] mb-2">
          {title}
        </h2>
        <p className="text-sm text-[#999999] max-w-sm">
          Esta pagina esta en desarrollo. El contenido estara disponible proximamente.
        </p>
      </motion.div>
    </div>
  );
}
