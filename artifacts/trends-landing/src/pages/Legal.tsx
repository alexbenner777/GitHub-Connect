import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DOCS, type DocId } from "@/components/LegalModal";
import logoPath from "@assets/logo_trends_1777962710178.png";

const VALID_IDS: DocId[] = ["terms", "privacy", "risks", "offer"];

export default function Legal() {
  const params = useParams<{ doc: string }>();
  const docId = params.doc as DocId;
  const doc = DOCS.find(d => d.id === docId);
  const Icon = doc?.icon;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [docId]);

  if (!doc || !VALID_IDS.includes(docId)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-white/50">
        <p className="text-lg">Документ не найден</p>
        <Link href="/" className="text-primary hover:underline text-sm">← На главную</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-white/8 bg-background/90 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Trends</span>
            <img src={logoPath} alt="" className="w-5 h-5 object-contain ml-0.5" />
          </Link>
          <div className="flex gap-1">
            {DOCS.map(d => (
              <Link key={d.id} href={`/legal/${d.id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  d.id === docId ? `${d.accent} bg-white/8` : "text-white/30 hover:text-white/60"
                }`}>
                {d.id === "terms" ? "Условия" :
                 d.id === "privacy" ? "Конф-ть" :
                 d.id === "risks" ? "Риски" : "Оферта"}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            {Icon && (
              <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${doc.accent}`} />
              </div>
            )}
            <div>
              <div className="text-xs text-white/30 uppercase tracking-widest mb-1">Юридический документ</div>
              <h1 className="text-2xl font-black">{doc.titleRu}</h1>
            </div>
          </div>

          {/* Body */}
          <div className="prose-legal">
            {doc.contentRu}
          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-white/8 flex flex-wrap gap-3">
            {DOCS.filter(d => d.id !== docId).map(d => (
              <Link key={d.id} href={`/legal/${d.id}`}
                className="px-4 py-2 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-colors">
                {d.titleRu}
              </Link>
            ))}
            <Link href="/"
              className="px-4 py-2 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-colors ml-auto">
              ← На главную
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
