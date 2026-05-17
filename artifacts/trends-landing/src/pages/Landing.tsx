import React, { useState, useEffect, useRef } from "react";
import { translations, type Lang } from "@/lib/translations";
import { Link } from "wouter";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InvestmentModal } from "@/components/InvestmentModal";
import { LegalModal, DOCS, type DocId } from "@/components/LegalModal";
import { SceneBackground } from "@/components/SceneBackground";
import { DauCalculator } from "@/components/DauCalculator";
import type { FullPackage } from "@/components/DauCalculator";
import { PACKAGES as PKG_SOURCE, PACKAGE_UI } from "@/lib/packages";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  ArrowRight, CheckCircle2, PlaySquare, TrendingUp, Users, Smartphone,
  BarChart3, Target, ShoppingBag, Gift, Wallet, ExternalLink,
  Network, Coins, ChevronRight, ChevronDown, DollarSign, UserPlus, Users2,
  Menu, X, Send, MessageCircle, Star, Shield, Zap, Crown,
  Mail, Globe, FileText, Lock, Code2, Megaphone, Server, Trophy
} from "lucide-react";

import logoPath from '@assets/logo_trends_1777962710178.png';
import screen1Path from '@assets/скрин_1_1777968001895.png';
import screen2Path from '@assets/скрин_2_1777969066507.png';
import screen3Path from '@assets/скрин_3_1777969064666.png';
import screenAppPath from '@assets/111_1778425377815.png';
import iphonePath from '@assets/iphone_фронт_1778532530856.png';
import videoPath from '@assets/trends_demo_video.mov';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
};
const fadeIn = fadeUp;
const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } }
};
const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } }
};
const fadeScale = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } }
};
const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};
const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.0 } }
};
const slideUp = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE } }
};

function MagneticButton({ children, className, onClick, ...props }: React.ComponentProps<typeof motion.div> & { onClick?: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.95 }}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const ADVANTAGES = [
  {
    title: "RevShare от монетизации платформы",
    desc: "20% всей рекламной выручки (7 источников) идёт напрямую в Investor Pool. Ежемесячные выплаты в USDT прямо на ваш кошелёк.",
    color: "text-primary", gradFrom: "from-primary/20", gradTo: "to-secondary/10", Icon: DollarSign, label: "01 / Ежедневный доход",
    extra: [
      "7 источников выручки: in-feed видеореклама, Sponsored Stories, баннеры, интерстишелы, E-commerce партнёрки, Branded Content, Premium подписки",
      "20% от всей рекламной выручки делится между инвесторами пропорционально пакету",
      "Ежемесячные выплаты напрямую на USDT-кошелёк",
      "Никаких блокировок — средства поступают в течение 48 часов после закрытия периода",
    ],
  },
  {
    title: "Собственный источник трафика",
    desc: "Специальные условия продвижения для инвесторов + приоритет в алгоритме. Используйте мощь платформы для своих проектов и каналов.",
    color: "text-secondary", gradFrom: "from-secondary/20", gradTo: "to-primary/5", Icon: TrendingUp, label: "02",
    extra: [
      "Приоритет в алгоритмической выдаче — ваш контент видят первым",
      "До 3× органический охват по сравнению с обычными пользователями",
      "Доступ к Trends Ads Manager (бета) — управление продвижением из личного кабинета",
      "Специальный инвесторский бейдж повышает доверие аудитории к вашим каналам",
    ],
  },
  {
    title: "Партнёрская программа",
    desc: "Получайте до 20% от инвестиций вашей структуры на 5 уровней в глубину (10%–5%–3%–1%–1%). Постройте источник пассивного дохода.",
    color: "text-green-400", gradFrom: "from-green-500/20", gradTo: "to-teal-500/5", Icon: Network, label: "03",
    extra: [
      "Уровень 1 — 10%: прямые приглашённые вами инвесторы",
      "Уровень 2 — 5%: партнёры ваших партнёров",
      "Уровни 3–5 — 3% / 1% / 1%: сеть растёт, вы зарабатываете",
      "Нет ограничений на размер сети — чем шире структура, тем выше пассивный доход",
      "Выплаты в USDT в течение 48 часов после каждого нового вложения в вашей сети",
    ],
  },
  {
    title: "Начисление токенов $TRND",
    desc: "Ранняя аллокация токенов с потенциалом кратного роста при листинге. Встроенный vesting для защиты цены токена.",
    color: "text-yellow-400", gradFrom: "from-yellow-500/20", gradTo: "to-orange-500/5", Icon: Coins, label: "04",
    extra: [
      "Аллокация пропорциональна размеру пакета — чем раньше входите, тем больше токенов",
      "Ранние инвесторы Pre-Seed получают бонус ×2 к аллокации",
      "Vesting: 12 месяцев cliff → 24 месяца линейное разблокирование (защита от обвала)",
      "Листинг запускается при достижении 10 млн пользователей платформы",
      "Токен имеет утилити-функции: governance, доступ к Premium, рекламный баланс",
    ],
  },
  {
    title: "Exit Upside × 20 – × 30",
    desc: "При продаже платформы стратегическому покупателю (оценка $200M–$500M) ваша доля принесёт сверхприбыль — от × 20 до × 30 от вложенного.",
    color: "text-primary", gradFrom: "from-primary/20", gradTo: "to-purple-500/10", Icon: Crown, label: "05",
    extra: [
      "Целевая оценка при продаже: $200M–$500M (аналоги: TikTok, Snap, Kuaishou)",
      "Потенциальные покупатели: телеком-операторы, медиагруппы, технологические гиганты",
      "Pre-Seed инвесторы входят при оценке компании $5–10M — максимальный upside",
      "Прогнозируемый горизонт: 3–5 лет до стратегического выхода",
      "Ваша доля фиксируется в момент инвестиции и не размывается без вашего согласия",
    ],
  },
];

type AdvantageItem = {
  title: string;
  desc: string;
  color: string;
  gradFrom: string;
  gradTo: string;
  Icon: React.ElementType;
  label: string;
  extra?: string[];
};

function AdvantageCard({ item, index, variants }: { item: AdvantageItem; index: number; variants: Variants }) {
  const { Icon } = item;
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial="visible" animate="visible"
      variants={variants}
      className="glass-card rounded-2xl overflow-hidden group relative cursor-pointer"
      onClick={() => setOpen(o => !o)}>
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradFrom} ${item.gradTo} transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />
      <div className="relative z-10 p-4 md:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Icon className={`w-4 h-4 md:w-5 md:h-5 ${item.color}`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-xs font-black tracking-widest uppercase ${item.color}`}>{item.label}</div>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }}>
              <ChevronDown className={`w-4 h-4 ${item.color} opacity-70`} />
            </motion.div>
          </div>
        </div>
        <h3 className="text-base md:text-lg font-black mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
        <AnimatePresence initial={false}>
          {open && item.extra && (
            <motion.div
              key="extra"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden">
              <ul className="mt-4 pt-4 border-t border-white/10 space-y-2">
                {item.extra.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AdvantagesGrid({ openInvest: _openInvest, advantages }: { openInvest: (pkg?: string) => void; advantages: AdvantageItem[] }) {
  const first = advantages[0];
  const { Icon: Icon0 } = first;
  const [open0, setOpen0] = useState(false);
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Item 1 — full width, expandable */}
      <motion.div initial="visible" animate="visible" variants={slideUp}
        className="glass-card rounded-2xl overflow-hidden group cursor-pointer relative"
        onClick={() => setOpen0(o => !o)}>
        <div className={`absolute inset-0 bg-gradient-to-br ${first.gradFrom} ${first.gradTo} transition-opacity duration-500 ${open0 ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />
        <div className="relative z-10 p-4 md:p-7 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Icon0 className={`w-6 h-6 md:w-7 md:h-7 ${first.color}`} />
          </div>
          <div className="flex-1">
            <div className={`text-xs font-black tracking-widest uppercase mb-2 ${first.color}`}>{first.label}</div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-black mb-2">{first.title}</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{first.desc}</p>
            <AnimatePresence initial={false}>
              {open0 && first.extra && (
                <motion.div
                  key="extra0"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden">
                  <ul className="mt-4 pt-4 border-t border-white/10 space-y-2">
                    {first.extra.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${first.color}`} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className={`text-[80px] font-black ${first.color} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500 hidden lg:block leading-none`}>01</div>
            <motion.div animate={{ rotate: open0 ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="hidden md:block">
              <ChevronDown className={`w-5 h-5 ${first.color} opacity-60`} />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Items 2 & 3 — two columns */}
      <div className="grid md:grid-cols-2 gap-5">
        <AdvantageCard item={advantages[1]} index={1} variants={fadeLeft} />
        <AdvantageCard item={advantages[2]} index={2} variants={fadeRight} />
      </div>

      {/* Items 4 & 5 — two columns */}
      <div className="grid md:grid-cols-2 gap-5">
        <AdvantageCard item={advantages[3]} index={3} variants={fadeLeft} />
        <AdvantageCard item={advantages[4]} index={4} variants={fadeRight} />
      </div>
    </div>
  );
}

function MonetizationCards({ t }: { t: (key: string) => string }) {
  const [mono1Open, setMono1Open] = useState(false);
  const [monoOpenIdx, setMonoOpenIdx] = useState<number | null>(null);
  const monoCards = [
    { icon: TrendingUp,  num: "02", title: t('mono2_title'), desc: t('mono2_desc'), extra: [t('mono2_x1'), t('mono2_x2'), t('mono2_x3'), t('mono2_x4')] },
    { icon: Gift,        num: "03", title: t('mono3_title'), desc: t('mono3_desc'), extra: [t('mono3_x1'), t('mono3_x2'), t('mono3_x3'), t('mono3_x4')] },
    { icon: Wallet,      num: "04", title: t('mono4_title'), desc: t('mono4_desc'), extra: [t('mono4_x1'), t('mono4_x2'), t('mono4_x3'), t('mono4_x4')] },
    { icon: BarChart3,   num: "05", title: t('mono5_title'), desc: t('mono5_desc'), extra: [t('mono5_x1'), t('mono5_x2'), t('mono5_x3'), t('mono5_x4')] },
    { icon: Smartphone,  num: "06", title: t('mono6_title'), desc: t('mono6_desc'), extra: [t('mono6_x1'), t('mono6_x2'), t('mono6_x3'), t('mono6_x4')] },
    { icon: ShoppingBag, num: "07", title: t('mono7_title'), desc: t('mono7_desc'), extra: [t('mono7_x1'), t('mono7_x2'), t('mono7_x3'), t('mono7_x4')] },
  ];
  return (
    <>
      {/* Card 01 — full width, expandable */}
      <motion.div initial="visible" animate="visible" variants={fadeScale} className="mb-6">
        <div
          className="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden cursor-pointer group"
          onClick={() => setMono1Open(o => !o)}
        >
          <div className="absolute top-6 right-8 text-8xl font-black text-primary/6 select-none">01</div>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl md:text-3xl font-bold">{t('mono1_title')}</h3>
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">{t('mono1_badge')}</span>
                <motion.div animate={{ rotate: mono1Open ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="ml-auto shrink-0">
                  <ChevronDown className="w-5 h-5 text-primary opacity-60" />
                </motion.div>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">{t('mono1_desc')}</p>
              <div className="flex flex-wrap gap-3">
                {["CPM", "CPV", "CPC", "CPA"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-sm border border-primary/20">{tag}</span>
                ))}
              </div>
              <AnimatePresence initial={false}>
                {mono1Open && (
                  <motion.ul
                    key="mono1-extra"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden mt-5 pt-5 border-t border-white/10 space-y-2"
                  >
                    {[t('mono1_x1'), t('mono1_x2'), t('mono1_x3'), t('mono1_x4')].map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cards 02-07 — grid, expandable */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {monoCards.map((item, i) => {
          const isOpen = monoOpenIdx === i;
          return (
            <div
              key={i}
              className="glass-card p-6 rounded-3xl group relative overflow-hidden cursor-pointer"
              onClick={() => setMonoOpenIdx(isOpen ? null : i)}
            >
              <div className="absolute top-4 right-5 text-5xl font-black text-primary/6 select-none group-hover:text-primary/12 transition-colors">{item.num}</div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="shrink-0 mt-0.5">
                  <ChevronDown className="w-4 h-4 text-primary opacity-60" />
                </motion.div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    key={`mono-extra-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden mt-4 pt-4 border-t border-white/10 space-y-2"
                  >
                    {item.extra.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}

const TARGET_AMOUNT = 100000;
const TARGET_INVESTORS = 13;
const GOAL = 500_000;
const PROGRESS_PCT = (TARGET_AMOUNT / GOAL) * 100;

function useCountUp(target: number, duration = 2000, delay = 400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setValue(Math.floor(ease * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, target, duration, delay]);
  return { value, ref };
}

// ─── Иконки для маппинга ─────────────────────────────────────────
const ICON_MAP = { Star, Shield, Crown, TrendingUp, Zap } as const;

// ─── Пакеты для лендинга — берутся из единого packages.ts ────────
const PACKAGES_DATA: FullPackage[] = PKG_SOURCE.map(p => {
  const ui = PACKAGE_UI[p.id];
  return { ...p, icon: ICON_MAP[ui.iconName], color: ui.color, border: ui.border, glow: ui.glow };
});

const NAV_HREFS = ["#problem", "#monetization", "#investors", "#roadmap"] as const;

export default function Landing() {
  const [lang, setLang] = useState<Lang>('ru');
  const t = (key: keyof typeof translations.ru): string => translations[lang][key] as string;

  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("founder3");
  const [users] = useState(7780);
  const [views] = useState(2550);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [refOpen, setRefOpen] = useState(false);
  const [exampleOpen, setExampleOpen] = useState(false);
  const [poolOpen, setPoolOpen] = useState(false);
  const [legalDoc, setLegalDoc] = useState<DocId | null>(null);

  const { scrollY: scrollYMotion } = useScroll();
  const heroY = useTransform(scrollYMotion, [0, 600], [0, -70]);

  const { value: raisedValue, ref: raisedRef } = useCountUp(TARGET_AMOUNT, 2200, 500);
  const { value: investorsValue, ref: investorsRef } = useCountUp(TARGET_INVESTORS, 1400, 600);


  useEffect(() => {
    const onScroll = () => {
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight - winH;
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openInvest = (pkg = "founder3") => {
    setSelectedPkg(pkg);
    setIsInvestOpen(true);
  };

  const NAV_LINKS = [
    { href: "#problem", label: t('nav_about') },
    { href: "#monetization", label: t('nav_monetization') },
    { href: "#investors", label: t('nav_investors') },
    { href: "#roadmap", label: "Roadmap" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground [overflow-x:clip]">

      <SceneBackground />

      {/* SCROLL PROGRESS */}
      <div className="fixed top-0 left-0 right-0 z-[70] h-[2px]">
        <div
          className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-none"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* NAV */}
      <nav className="fixed top-[2px] w-full z-50 glass-nav">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoPath} alt="Trends Logo" className="w-10 h-10 object-contain" />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, letterSpacing: '-0.02em' }} className="text-2xl text-white">Trends</span>
          </div>

          <div className="hidden lg:flex gap-6 text-sm font-medium text-muted-foreground">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="hover:text-primary transition-colors whitespace-nowrap">{link.label}</a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 gap-0.5">
              {(['ru', 'en'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === l
                      ? "bg-white/15 text-white"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <span>{l === 'ru' ? '🇷🇺' : '🇺🇸'}</span>
                  <span>{l.toUpperCase()}</span>
                </button>
              ))}
            </div>
            <Link href="/cabinet">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary font-semibold whitespace-nowrap">{t('nav_cabinet')}</Button>
            </Link>
            <motion.div whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.04 }}>
              <Button onClick={() => openInvest()} className="btn-grad btn-3d text-background font-bold rounded-xl whitespace-nowrap">
                {t('nav_invest')}
              </Button>
            </motion.div>
          </div>

          <button
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen
                ? <motion.div key="c" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-6 h-6" /></motion.div>
                : <motion.div key="o" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-6 h-6" /></motion.div>
              }
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="lg:hidden overflow-hidden border-t border-white/10"
              style={{ background: "rgba(6, 9, 20, 0.97)", backdropFilter: "blur(28px)" }}
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map(link => (
                  <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className="py-3 px-4 rounded-xl text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-white/10 mt-3 pt-4 flex flex-col gap-3">
                  {/* Language switcher mobile */}
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 gap-0.5 self-start">
                    {(['ru', 'en'] as Lang[]).map(l => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          lang === l
                            ? "bg-white/15 text-white"
                            : "text-muted-foreground hover:text-white"
                        }`}
                      >
                        <span>{l === 'ru' ? '🇷🇺' : '🇺🇸'}</span>
                        <span>{l.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                  <Link href="/cabinet" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10">{t('nav_cabinet')}</Button>
                  </Link>
                  <Button onClick={() => { openInvest(); setMobileMenuOpen(false); }}
                    className="w-full btn-grad btn-3d font-bold">
                    {t('nav_invest')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-10 lg:pt-44 lg:pb-28 px-4 relative z-10">
        <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

          {/* MOBILE BADGES — above image on mobile */}
          <div className="flex flex-wrap gap-3 mt-2 mb-3 lg:hidden order-1">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold">{t('badge_preseed')}</div>
            <div className="px-3 py-1 rounded-full border text-sm font-bold" style={{ background: "rgba(123,94,255,0.25)", borderColor: "#7B5EFF", color: "#c4b0ff", boxShadow: "0 0 14px 2px rgba(123,94,255,0.45)", textShadow: "0 0 8px #7B5EFF" }}>{t('badge_goal')}</div>
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {t('badge_mvp')}
            </div>
          </div>

          {/* IMAGE — second on mobile, second on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            style={{ y: heroY }}
            className="relative flex items-center justify-center order-2 lg:order-2 mb-2 lg:mb-0"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-primary blur-[80px]"
              />
            </div>
            <motion.img
              src={screen1Path}
              alt="Trends App"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 max-h-[80vh] sm:max-h-[75vh] lg:max-h-[85vh] w-full object-contain drop-shadow-2xl"
            />
          </motion.div>


          {/* TEXT — third on mobile, first on desktop */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6 lg:space-y-8 order-3 lg:order-1">
            <div className="hidden lg:flex flex-wrap gap-3">
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold">{t('badge_preseed')}</div>
              <div className="px-3 py-1 rounded-full border text-sm font-bold" style={{ background: "rgba(123,94,255,0.25)", borderColor: "#7B5EFF", color: "#c4b0ff", boxShadow: "0 0 14px 2px rgba(123,94,255,0.45)", textShadow: "0 0 8px #7B5EFF" }}>{t('badge_goal')}</div>
              <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {t('badge_mvp')}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              {t('hero_title1')} <span className="text-gradient">Reels</span> {t('hero_title2')}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              {t('hero_subtitle')}
            </p>

            <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground font-semibold">{t('hero_goal_label')}</span>{" "}
                {t('hero_goal_desc')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <MagneticButton onClick={() => openInvest()} className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 text-lg btn-grad btn-3d font-bold rounded-xl pointer-events-none w-full">
                  {t('hero_btn_invest')} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </MagneticButton>
              <Link href="/cabinet" className="w-full sm:w-auto">
                <MagneticButton className="w-full">
                  <Button variant="outline" size="lg"
                    className="h-14 px-8 text-lg border-primary/30 hover:bg-primary/10 hover:border-primary/50 rounded-xl w-full btn-3d-outline pointer-events-none">
                    {t('hero_btn_cabinet')}
                  </Button>
                </MagneticButton>
              </Link>
            </div>

          </motion.div>

        </div>
        </div>
      </section>

      {/* MINIAPP STATS STRIP */}
      <section className="py-6 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { label: t('stats_users_label'), value: "12 400+", sub: t('stats_users_sub') },
              { label: t('stats_dau_label'), value: "3 200+", sub: t('stats_dau_sub') },
              { label: t('stats_videos_label'), value: "48 000+", sub: t('stats_videos_sub') },
              { label: t('stats_countries_label'), value: "34", sub: t('stats_countries_sub') },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-black text-gradient">{s.value}</div>
                <div className="text-xs font-semibold mt-1">{s.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section id="problem" className="py-14 md:py-24 relative z-10 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div initial="visible" animate="visible" variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">{t('problem_title')}</h2>
            <p className="text-lg text-muted-foreground">{t('problem_subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial="visible" animate="visible" variants={fadeLeft}
              className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-8">{t('problem_now')}</h3>
              <ul className="space-y-6">
                {[
                  t('problem_p1'),
                  t('problem_p2'),
                  t('problem_p3')
                ].map((text, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 text-destructive mt-0.5">✕</div>
                    <span className="text-lg text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="visible" animate="visible" variants={fadeRight}
              className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-8 text-primary">{t('solution_title')}</h3>
              <ul className="space-y-6">
                {[
                  t('solution_s1'),
                  t('solution_s2'),
                  t('solution_s3')
                ].map((text, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary mt-0.5"><ArrowRight className="w-4 h-4" /></div>
                    <span className="text-lg font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-gradient mb-2">1B+</div>
              <div className="text-muted-foreground font-medium uppercase tracking-wider">{t('stat_users')}</div>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block" />
            <div>
              <div className="text-5xl font-black text-gradient mb-2">500M+</div>
              <div className="text-muted-foreground font-medium uppercase tracking-wider">{t('stat_miniapps')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS TRENDS */}
      <section className="py-14 md:py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-6 order-2 lg:order-1 lg:pl-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black">
                {t('what_title')} <span className="text-gradient">Trends</span>?
              </h2>
              <div className="space-y-5 leading-relaxed">
                <p className="text-foreground font-semibold text-lg">{t('what_lead')}</p>
                <div className="space-y-3">
                  {[
                    {
                      label: t('what_users_label'),
                      icon: Users,
                      accent: "border-l-primary bg-primary/5",
                      iconColor: "text-primary bg-primary/15",
                      labelColor: "text-primary",
                      text: t('what_users_text'),
                    },
                    {
                      label: t('what_creators_label'),
                      icon: PlaySquare,
                      accent: "border-l-secondary bg-secondary/5",
                      iconColor: "text-secondary bg-secondary/15",
                      labelColor: "text-secondary",
                      text: t('what_creators_text'),
                    },
                    {
                      label: t('what_telegram_label'),
                      icon: Send,
                      accent: "border-l-blue-400 bg-blue-400/5",
                      iconColor: "text-blue-400 bg-blue-400/15",
                      labelColor: "text-blue-400",
                      text: t('what_telegram_text'),
                    },
                  ].map(({ label, icon: Icon, accent, iconColor, labelColor, text }) => (
                    <div key={label} className={`flex items-start gap-4 pl-4 pr-5 py-4 rounded-xl border-l-2 ${accent}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-sm font-bold mb-1 ${labelColor}`}>{label}</div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden">
                <MagneticButton onClick={() => openInvest()} className="w-full sm:w-auto">
                  <Button size="lg" className="h-14 px-8 text-lg btn-grad btn-3d font-bold rounded-xl pointer-events-none w-full sm:w-auto">
                    Инвестировать в Trends <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </MagneticButton>
              </div>
            </div>
            <motion.div initial="visible" animate="visible" variants={fadeRight}
              className="relative flex justify-center items-center order-1 lg:order-2 mb-6 lg:mb-0">
              {/* Glow behind phone */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 lg:w-56 lg:h-56 rounded-full bg-secondary/30 blur-[80px]" />
              </div>
              {/* iPhone + video composite */}
              <div className="relative inline-flex justify-center items-center" style={{ height: 'clamp(520px, 95vw, 580px)' }}>
                {/* Video clipped to phone screen area */}
                <div className="absolute z-0 overflow-hidden rounded-[9%]"
                  style={{ top: '1%', bottom: '1%', left: '8%', right: '8%' }}>
                  <video
                    autoPlay muted loop playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={videoPath} type="video/mp4" />
                    <source src={videoPath} type="video/quicktime" />
                  </video>
                </div>
                {/* iPhone frame on top */}
                <img src={iphonePath} alt="Trends App"
                  className="relative z-10 h-full w-auto object-contain drop-shadow-2xl"
                  style={{ mixBlendMode: 'multiply', transform: 'scaleX(1.06) scaleY(1.078) translateY(-3.6%)', transformOrigin: 'top center' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MVP */}
      <section className="py-14 md:py-24 relative z-10 [overflow-x:clip]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial="visible" animate="visible" variants={fadeLeft}
              className="relative flex justify-center order-1 lg:order-1">
              <img src={screen3Path} alt="Trends MVP" className="relative z-10 max-h-[480px] lg:max-h-[620px] w-full object-contain drop-shadow-2xl" />
            </motion.div>

            <div className="space-y-6 lg:space-y-8 order-2 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t('mvp_badge')}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">{t('mvp_title1')} <span className="text-gradient">{t('mvp_title2')}</span></h2>
              <p className="text-base md:text-xl text-muted-foreground">{t('mvp_desc')}</p>

              <div className="space-y-4">
                {[
                  t('mvp_f1'),
                  t('mvp_f2'),
                  t('mvp_f3'),
                  t('mvp_f4'),
                  t('mvp_f5')
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 glass-card p-4 rounded-2xl">
                    <CheckCircle2 className="w-7 h-7 text-green-400 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* TOKEN ATTENTION ECONOMY */}
      <section className="py-14 md:py-28 relative z-10 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[160px]" style={{ background: "radial-gradient(ellipse, rgba(123,94,255,0.12) 0%, rgba(0,212,255,0.08) 60%, transparent 100%)" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">

          {/* Header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-sm font-bold mb-6">
              <Coins className="w-4 h-4" /> {t('token_section_badge')}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-5 leading-tight">
              {t('token_section_title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('token_section_desc')}</p>
          </motion.div>

          {/* 3 earn cards */}
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              {
                icon: Users2, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20",
                title: t('token_viewers_title'), desc: t('token_viewers_desc'), num: "01",
              },
              {
                icon: Star, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20",
                title: t('token_creators_title'), desc: t('token_creators_desc'), num: "02",
              },
              {
                icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20",
                title: t('token_investors_title'), desc: t('token_investors_desc'), num: "03",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: EASE } } }}
                className={`glass-card p-7 rounded-3xl border ${card.border} relative overflow-hidden`}
              >
                <div className="absolute top-4 right-5 text-5xl font-black opacity-5 select-none">{card.num}</div>
                <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} mb-5`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-3">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Why $TRND block */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
            className="glass-card rounded-3xl p-8 md:p-10 border border-secondary/15 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-black mb-3">{t('token_why_title')}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{t('token_why_desc')}</p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      t('token_why1'), t('token_why2'),
                      t('token_why3'), t('token_why4'),
                      t('token_why5'), t('token_why6'),
                    ].map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compare + CTA panel */}
                <div className="flex flex-col items-center justify-center gap-4 md:w-72 shrink-0">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {["Notcoin", "Catizen", "Hamster"].map((name, i) => (
                      <div key={i} className="glass-card rounded-xl p-3 flex flex-col items-center gap-1.5 border border-white/8">
                        <Trophy className={`w-5 h-5 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-primary' : 'text-secondary'}`} />
                        <span className="text-xs font-bold text-center leading-tight">{name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center px-2">
                    <div className="text-lg font-black text-white mb-2">{t('token_compare_title')}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t('token_compare_desc')}</p>
                  </div>
                  <Button
                    onClick={() => { setSelectedPkg("founder3"); setIsInvestOpen(true); }}
                    className="w-full rounded-xl font-bold"
                    style={{ background: "linear-gradient(135deg, #7B5EFF, #00D4FF)" }}
                  >
                    {t('token_cta')} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MONETIZATION */}
      <section id="monetization" className="py-14 md:py-24 relative z-10 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">{t('mono_title')}</h2>
            <p className="text-lg text-muted-foreground">{t('mono_desc')}</p>
          </div>

          <MonetizationCards t={t} />
        </div>
      </section>

      {/* PRODUCT FULL */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">{t('product_title')} <span className="text-gradient">Trends</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('product_desc')}</p>
          </div>

          <motion.div initial="visible" animate="visible" variants={fadeScale}>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,212,255,0.08)]">
              <img src={screen2Path} alt="Продукт Trends" className="w-full object-cover" />
            </div>
            <div className="mt-10 flex justify-center">
              <MagneticButton className="w-auto">
                <a href="https://t.me/Trends_ibot?startapp" target="_blank" rel="noopener noreferrer">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.93 }}>
                    <Button size="lg" className="h-14 px-10 text-lg btn-grad btn-3d font-bold rounded-xl pointer-events-none">
                      <ExternalLink className="mr-2 w-5 h-5" />
                      {t('product_btn')}
                    </Button>
                  </motion.div>
                </a>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5 INVESTOR ADVANTAGES */}
      <section id="investors" className="py-16 md:py-24 lg:py-32 relative z-10 [overflow-x:clip] scroll-mt-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">{t('adv_title')}</h2>
            <p className="text-base md:text-xl text-muted-foreground">{t('adv_desc')}</p>
          </div>

          <AdvantagesGrid openInvest={openInvest} advantages={[
            { title: t('adv1_title'), desc: t('adv1_desc'), color: "text-primary", gradFrom: "from-primary/20", gradTo: "to-secondary/10", Icon: DollarSign, label: t('adv1_label'), extra: [t('adv1_x1'), t('adv1_x2'), t('adv1_x3'), t('adv1_x4')] },
            { title: t('adv2_title'), desc: t('adv2_desc'), color: "text-secondary", gradFrom: "from-secondary/20", gradTo: "to-primary/5", Icon: TrendingUp, label: t('adv2_label'), extra: [t('adv2_x1'), t('adv2_x2'), t('adv2_x3'), t('adv2_x4')] },
            { title: t('adv3_title'), desc: t('adv3_desc'), color: "text-green-400", gradFrom: "from-green-500/20", gradTo: "to-teal-500/5", Icon: Network, label: t('adv3_label'), extra: [t('adv3_x1'), t('adv3_x2'), t('adv3_x3'), t('adv3_x4'), t('adv3_x5')] },
            { title: t('adv4_title'), desc: t('adv4_desc'), color: "text-yellow-400", gradFrom: "from-yellow-500/20", gradTo: "to-orange-500/5", Icon: Coins, label: t('adv4_label'), extra: [t('adv4_x1'), t('adv4_x2'), t('adv4_x3'), t('adv4_x4'), t('adv4_x5')] },
            { title: t('adv5_title'), desc: t('adv5_desc'), color: "text-primary", gradFrom: "from-primary/20", gradTo: "to-purple-500/10", Icon: Crown, label: t('adv5_label'), extra: [t('adv5_x1'), t('adv5_x2'), t('adv5_x3'), t('adv5_x4'), t('adv5_x5')] },
          ]} />
        </div>
      </section>

      {/* DAU CALCULATOR + INVESTMENT PACKAGES (merged) */}
      <DauCalculator
        onInvest={openInvest}
        onSelectPackage={openInvest}
        fullPackages={PACKAGES_DATA}
      />

      {/* MLM + COMMUNITY POOL — collapsible */}
      <section className="py-14 md:py-24 relative z-10 [overflow-x:clip]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-green-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          {/* Section header — static */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm mb-6">
              <Network className="w-4 h-4" />
              {t('mlm_badge')}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">{t('mlm_title')}</h2>
            <p className="text-lg text-muted-foreground">{t('mlm_desc')}</p>
          </div>

          {/* Accordion 1 — Реф программа */}
          <div className="max-w-4xl mx-auto mb-3">
            <button
              onClick={() => setRefOpen(o => !o)}
              className="w-full flex items-center justify-between px-6 py-5 glass-card rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-200 group focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                  <Network className="w-4 h-4 text-primary" />
                </div>
                <span className="text-base sm:text-lg font-bold group-hover:text-primary transition-colors">{t('mlm_acc1')}</span>
              </div>
              <motion.span animate={{ rotate: refOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronRight className="w-5 h-5 rotate-90 text-muted-foreground" />
              </motion.span>
            </button>
            <AnimatePresence>
            {refOpen && (
              <motion.div key="ref-content" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
                <div className="glass-card px-6 py-5 rounded-2xl mt-2 space-y-2">
                  {[
                    { n: 1, pct: "10%", desc: t('mlm_ref_l1'), bar: 100, grad: "from-primary to-primary/60", badge: "bg-primary/20 text-primary border-primary/30" },
                    { n: 2, pct: "5%",  desc: t('mlm_ref_l2'), bar: 70,  grad: "from-secondary to-secondary/60", badge: "bg-secondary/20 text-secondary border-secondary/30" },
                    { n: 3, pct: "3%",  desc: t('mlm_ref_l3'), bar: 48,  grad: "from-blue-400 to-blue-400/60", badge: "bg-blue-400/20 text-blue-400 border-blue-400/30" },
                    { n: 4, pct: "1%",  desc: t('mlm_ref_l4'), bar: 28,  grad: "from-cyan-400 to-cyan-400/60", badge: "bg-cyan-400/20 text-cyan-400 border-cyan-400/30" },
                    { n: 5, pct: "1%",  desc: t('mlm_ref_l5'), bar: 18,  grad: "from-teal-400 to-teal-400/60", badge: "bg-teal-400/20 text-teal-400 border-teal-400/30" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`shrink-0 text-xs font-black px-2.5 py-1 rounded-lg border ${row.badge}`}>L{row.n}</div>
                      <div className="shrink-0 w-10 text-right">
                        <span className={`text-lg font-black ${row.badge.split(' ')[1]}`}>{row.pct}</span>
                      </div>
                      <div className="flex-1 relative h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${row.bar}%` }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.7, delay: i * 0.08 }}
                          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${row.grad}`}
                        />
                      </div>
                      <div className="shrink-0 text-sm text-muted-foreground w-48 text-right hidden md:block">{row.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          {/* Accordion 2 — Пример */}
          <div className="max-w-4xl mx-auto mb-3">
            <button
              onClick={() => setExampleOpen(o => !o)}
              className="w-full flex items-center justify-between px-6 py-5 glass-card rounded-2xl border border-white/10 hover:border-green-500/30 transition-all duration-200 group focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/15 border border-green-500/25 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-base sm:text-lg font-bold group-hover:text-green-400 transition-colors">{t('mlm_acc2')}</span>
              </div>
              <motion.span animate={{ rotate: exampleOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronRight className="w-5 h-5 rotate-90 text-muted-foreground" />
              </motion.span>
            </button>
            <AnimatePresence>
            {exampleOpen && (
              <motion.div key="example-content" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
                <div className="glass-card p-4 sm:p-8 md:p-10 rounded-3xl border border-green-500/20 mt-2">
            <div className="flex items-start gap-3 mb-6 md:mb-8">
              <div className="w-9 h-9 shrink-0 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-2xl font-bold leading-snug">{t('mlm_ex_title')}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t('mlm_ex_sub')}</p>
              </div>
            </div>

            {/* Visual referral tree — chaotic */}
            <div className="mb-6 md:mb-8 p-3 sm:p-5 rounded-2xl bg-white/3 border border-white/8 overflow-x-auto">
              <div className="min-w-[300px]">
                {/* YOU */}
                <div className="flex justify-center mb-2">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary font-black text-sm">{t('mlm_you')}</div>
                    <div className="text-[10px] text-primary font-bold mt-1">$5 000</div>
                  </div>
                </div>
                {/* L1 connector line */}
                <div className="flex justify-center mb-1"><div className="w-px h-3 bg-primary/40" /></div>
                <div className="relative flex justify-center mb-1">
                  <div className="absolute top-0 left-[15%] right-[15%] h-px bg-primary/25" />
                  <div className="w-px h-3 bg-primary/40" />
                </div>
                {/* L1 — 6 chaotic invites */}
                <div className="flex justify-between gap-1 mb-2 px-0">
                  {[
                    { l: "А", amt: "$25K", bonus: "+$2 500", color: "bg-yellow-400/20 border-yellow-400/50 text-yellow-300" },
                    { l: "Б", amt: "$25K", bonus: "+$2 500", color: "bg-yellow-400/20 border-yellow-400/50 text-yellow-300" },
                    { l: "В", amt: "$100K", bonus: "+$10 000", color: "bg-orange-400/25 border-orange-400/60 text-orange-300" },
                    { l: "Г", amt: "$5K", bonus: "+$500", color: "bg-secondary/20 border-secondary/40 text-secondary" },
                    { l: "Д", amt: "$5K", bonus: "+$500", color: "bg-secondary/20 border-secondary/40 text-secondary" },
                  ].map(({ l, amt, bonus, color }, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs ${color}`}>{l}</div>
                      <div className="text-[7px] text-muted-foreground mt-0.5">{amt}</div>
                      <div className="text-[7px] text-green-400 font-bold">{bonus}</div>
                    </div>
                  ))}
                </div>
                {/* L2 connectors */}
                <div className="flex justify-between gap-1 mb-1 px-0">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className="flex-1 flex justify-center"><div className="w-px h-2 bg-white/20" /></div>
                  ))}
                </div>
                {/* L2 — chaotic, different amounts */}
                <div className="flex justify-between gap-0.5 px-0 mb-1">
                  {[
                    { amt: "$10K", bonus: "+$500" },
                    { amt: "$1K",  bonus: "+$50" },
                    { amt: "$5K",  bonus: "+$250" },
                    { amt: "$25K", bonus: "+$1 250" },
                    { amt: "$1K",  bonus: "+$50" },
                    { amt: "$5K",  bonus: "+$250" },
                    { amt: "$1K",  bonus: "+$50" },
                    { amt: "$10K", bonus: "+$500" },
                  ].map(({ amt, bonus }, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-400/15 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold text-[8px]">
                        {String.fromCharCode(49 + i)}
                      </div>
                      <div className="text-[6px] text-muted-foreground mt-0.5">{amt}</div>
                      <div className="text-[6px] text-green-400 font-bold">{bonus}</div>
                    </div>
                  ))}
                </div>
                {/* L3+ hint */}
                <div className="flex justify-between gap-0.5 px-0 mb-1">
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <div key={i} className="flex-1 flex justify-center"><div className="w-px h-2 bg-white/10" /></div>
                  ))}
                </div>
                <div className="flex justify-between gap-0.5 px-0 mb-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex-1 flex justify-center">
                      <div className="w-4 h-4 rounded bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-teal-400/50" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-[10px] text-muted-foreground">{t('mlm_lvls_grow')}</div>
              </div>
            </div>

            {/* Breakdown — single card with rows */}
            <div className="glass-card rounded-2xl overflow-hidden mb-6 md:mb-8">
              {[
                { label: "L1 · 10%", icon: UserPlus,  bg: "bg-yellow-400/10",  color: "text-yellow-400",  desc: "2 × $25K",   result: "+$5 000",  resultColor: "text-yellow-400" },
                { label: "L1 · 10%", icon: Crown,     bg: "bg-orange-400/10", color: "text-orange-400", desc: "1 × $100K",  result: "+$10 000", resultColor: "text-orange-400" },
                { label: "L1 · 10%", icon: Users2,    bg: "bg-secondary/10",  color: "text-secondary",  desc: "2 × $5K",    result: "+$1 000",  resultColor: "text-secondary" },
                { label: "L2 · 5%",  icon: Users2,    bg: "bg-blue-400/10",   color: "text-blue-400",   desc: t('mlm_net50'),  result: "+$2 500",  resultColor: "text-blue-400" },
                { label: "L2 · 5%",  icon: Network,   bg: "bg-teal-400/10",   color: "text-teal-400",   desc: t('mlm_net8'),   result: "+$400",    resultColor: "text-teal-400" },
                { label: "L3–5",     icon: Network,   bg: "bg-purple-400/10", color: "text-purple-400", desc: t('mlm_deeper'), result: "+$1 200", resultColor: "text-purple-400" },
              ].map((row, i, arr) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-white/6" : ""}`}>
                  <div className={`w-7 h-7 rounded-lg ${row.bg} flex items-center justify-center shrink-0`}>
                    <row.icon className={`w-3.5 h-3.5 ${row.color}`} />
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${row.color} shrink-0 w-14`}>{row.label}</div>
                  <div className="flex-1 min-w-0 text-xs text-muted-foreground truncate">{row.desc}</div>
                  <div className={`text-sm sm:text-base font-black ${row.resultColor} shrink-0`}>{row.result}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-6 rounded-2xl glass-card">
              <div className="flex-1 text-center sm:text-left">
                <div className="text-sm text-muted-foreground mb-1">{t('mlm_ex_total_label')}</div>
                <div className="text-4xl sm:text-5xl font-black text-green-400">$20 100</div>
                <div className="text-xs text-muted-foreground mt-1">L1: $16 000 · L2: $2 900 · L3–5: $1 200</div>
              </div>
              <div className="w-full h-px sm:w-px sm:h-12 bg-white/10" />
              <div className="text-center sm:text-left">
                <div className="text-sm text-muted-foreground mb-1">{t('mlm_ex_revshare')}</div>
                <div className="text-2xl sm:text-3xl font-black text-primary">+$626 / мес</div>
                <div className="text-xs text-muted-foreground/70 mt-1">при 10M DAU</div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              {t('mlm_ex_footnote')}
            </p>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          {/* Accordion 3 — Community Pool */}
          <div className="max-w-4xl mx-auto mb-3">
            <button
              onClick={() => setPoolOpen(o => !o)}
              className="w-full flex items-center justify-between px-6 py-5 glass-card rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-200 group focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-500/15 border border-yellow-500/25 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-left">
                  <span className="text-base sm:text-lg font-bold group-hover:text-yellow-400 transition-colors block">{t('mlm_acc3')}</span>
                  <span className="text-xs text-muted-foreground">{t('mlm_pool_sub')}</span>
                </div>
              </div>
              <motion.span animate={{ rotate: poolOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronRight className="w-5 h-5 rotate-90 text-muted-foreground" />
              </motion.span>
            </button>
            <AnimatePresence>
            {poolOpen && (
              <motion.div key="pool-content" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
                <div className="mt-2">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed px-2 py-3">
                  {t('mlm_pool_desc')}
                </p>

            {/* Mini Pool + Max Pool */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerChildren}
              className="grid md:grid-cols-2 gap-4 mb-5">
              {[
                {
                  name: "Mini Pool",
                  pct: "6%",
                  color: "text-primary",
                  border: "border-primary/25",
                  bg: "bg-primary/5",
                  badgeBg: "bg-primary/10",
                  conditions: [t('mini_pool_c1'), t('mini_pool_c2')],
                  share: t('mini_pool_share'),
                  shareColor: "text-primary",
                },
                {
                  name: "Max Pool",
                  pct: "4%",
                  color: "text-secondary",
                  border: "border-secondary/25",
                  bg: "bg-secondary/5",
                  badgeBg: "bg-secondary/10",
                  conditions: [t('max_pool_c1'), t('max_pool_c2')],
                  share: t('max_pool_share'),
                  shareColor: "text-secondary",
                },
              ].map((pool, i) => (
                <motion.div key={i} variants={i === 0 ? fadeLeft : fadeRight}
                  className={`glass-card rounded-2xl p-5 border ${pool.border}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-lg font-black ${pool.color}`}>{pool.name}</span>
                    <span className={`text-4xl font-black ${pool.color}`}>{pool.pct}</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    {pool.conditions.map((c, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${pool.color} opacity-70`} />
                        <span className="text-sm text-muted-foreground">{c}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`flex items-center gap-2 pt-3 border-t ${pool.border}`}>
                    <Coins className={`w-4 h-4 shrink-0 ${pool.shareColor} opacity-70`} />
                    <span className={`text-sm font-semibold ${pool.shareColor}`}>{pool.share}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Example table */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={slideUp}
              className="glass-card rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="px-5 py-3 border-b border-white/8">
                <span className="text-[11px] font-black tracking-widest uppercase text-muted-foreground">
                  {t('pool_table_header')}
                </span>
              </div>
              {/* Rows */}
              {[
                { label: t('pool_row_total'), value: "$250 000", bold: true, valueColor: "" },
                { label: "Community Pool (10%)", value: "$25 000", bold: false, valueColor: "text-yellow-400" },
                { label: "Mini Pool (6%)", value: "$15 000", bold: false, valueColor: "text-primary" },
                { label: "Max Pool (4%)", value: "$10 000", bold: false, valueColor: "text-secondary" },
              ].map((row, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-3 border-b border-white/6 ${row.bold ? "bg-white/3" : ""}`}>
                  <span className={`text-sm ${row.bold ? "font-bold" : "text-muted-foreground"}`}>{row.label}</span>
                  <span className={`text-sm font-black ${row.valueColor || ""}`}>{row.value}</span>
                </div>
              ))}
              {/* Results block */}
              <div className="px-5 py-4 bg-white/2 space-y-3">
                <p className="text-xs font-bold text-muted-foreground">
                  {t('pool_share_label')}
                </p>
                <div className="flex items-center justify-between rounded-xl bg-secondary/10 border border-secondary/20 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-secondary/30 border border-secondary/50 flex items-center justify-center text-secondary text-[10px] font-black">2</div>
                    <span className="text-sm text-muted-foreground">{t('pool_shares_label')}</span>
                  </div>
                  <span className="text-lg font-black text-secondary">$5 000 / каждому</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center text-primary text-[10px] font-black">8</div>
                    <span className="text-sm text-muted-foreground">{t('pool_shares_total')}</span>
                  </div>
                  <span className="text-lg font-black text-primary">$1 875 / каждому</span>
                </div>
              </div>
            </motion.div>

            {/* Footer notes */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeIn}
              className="grid sm:grid-cols-2 gap-3 mt-4">
              {[t('pool_note1'), t('pool_note2')].map((note, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
                  <span>{note}</span>
                </div>
              ))}
            </motion.div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* FUNDRAISING ROADMAP — 2 rounds */}
      <section className="py-14 md:py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-5">
                <Target className="w-4 h-4" />
                {t('rounds_badge')}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                {t('rounds_title')} <span className="text-gradient">{t('rounds_title_grad')}</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('rounds_subtitle')}
              </p>
            </div>

            {/* Two rounds side by side */}
            <div className="grid md:grid-cols-2 gap-5 mb-8">

              {/* Round 1 — ACTIVE */}
              <div className="relative rounded-2xl border border-primary/40 bg-primary/5 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                    {t('round1_badge')}
                  </div>
                </div>
                <div className="text-xs font-black tracking-widest uppercase text-primary mb-2">{t('round1_label')}</div>
                <h3 className="text-2xl font-black mb-1">{t('round1_name')}</h3>
                <div className="text-4xl font-black text-primary mb-1">$500 000</div>
                <p className="text-sm text-muted-foreground mb-5">{t('round1_desc')}</p>

                {/* Progress bar for round 1 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-green-400">{t('round1_raised')}</span>
                    <span className="text-muted-foreground">{t('round1_goal')}</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-white/8 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: "linear-gradient(90deg, #00D4FF, #7B5EFF)" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: "20%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <div className="absolute inset-y-0 left-[20%] flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-primary shadow-lg shadow-primary/50 -translate-x-1/2" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                    <span>{t('round1_pct')}</span>
                    <span>{t('round1_remaining')}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span><span className="font-bold text-foreground">{t('round1_f1')}</span> <span className="text-muted-foreground">{t('round1_f1b')}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{t('round1_f2')}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{t('round1_f3')}</span>
                  </div>
                </div>
              </div>

              {/* Round 2 — UPCOMING */}
              <div className="relative rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                    {t('round2_badge')}
                  </div>
                </div>
                <div className="text-xs font-black tracking-widest uppercase text-secondary mb-2">{t('round2_label')}</div>
                <h3 className="text-2xl font-black mb-1">{t('round2_name')}</h3>
                <div className="text-4xl font-black text-secondary mb-1">$1 500 000</div>
                <p className="text-sm text-muted-foreground mb-5">{t('round2_desc')}</p>

                {/* Progress bar for round 2 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-muted-foreground">{t('round2_raised')}</span>
                    <span className="text-muted-foreground">{t('round2_goal')}</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-white/8 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-0 rounded-full" style={{ background: "linear-gradient(90deg, #7B5EFF, #00D4FF)" }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5">{t('round2_opens')}</div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    </div>
                    <span><span className="font-bold text-foreground">{t('round2_f1')}</span> <span className="text-muted-foreground">{t('round2_f1b')}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    </div>
                    <span className="text-muted-foreground">{t('round2_f2')}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    </div>
                    <span className="text-muted-foreground">{t('round2_f3')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Math summary */}
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black">{t('spending_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('spending_subtitle')}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Code2,
                    label: t('spending_dev'),
                    amount: "$100 000",
                    note: t('spending_dev_note'),
                    color: "text-green-400",
                    bg: "bg-green-500/10 border-green-500/20",
                    iconBg: "bg-green-500/15 text-green-400",
                    badge: t('badge_done'),
                    badgeColor: "bg-green-500/20 text-green-400",
                  },
                  {
                    icon: Server,
                    label: t('spending_infra'),
                    amount: "$200 000",
                    note: t('spending_infra_note'),
                    color: "text-secondary",
                    bg: "bg-secondary/5 border-secondary/20",
                    iconBg: "bg-secondary/15 text-secondary",
                    badge: "Pre-Seed",
                    badgeColor: "bg-secondary/20 text-secondary",
                  },
                  {
                    icon: Megaphone,
                    label: t('spending_marketing'),
                    amount: "$1 500 000",
                    note: t('spending_marketing_note'),
                    color: "text-primary",
                    bg: "bg-primary/5 border-primary/20",
                    iconBg: "bg-primary/15 text-primary",
                    badge: "Pre-Seed",
                    badgeColor: "bg-primary/20 text-primary",
                  },
                  {
                    icon: Users,
                    label: t('spending_team'),
                    amount: "$200 000",
                    note: t('spending_team_note'),
                    color: "text-yellow-400",
                    bg: "bg-yellow-500/5 border-yellow-500/20",
                    iconBg: "bg-yellow-500/15 text-yellow-400",
                    badge: "Pre-Seed",
                    badgeColor: "bg-yellow-500/20 text-yellow-400",
                  },
                ].map(({ icon: Icon, label, amount, note, color, bg, iconBg, badge, badgeColor }) => (
                  <div key={label} className={`rounded-xl border p-5 ${bg}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                    </div>
                    <div className={`text-xl font-black mb-0.5 ${color}`}>{amount}</div>
                    <div className="text-sm font-semibold text-foreground mb-0.5">{label}</div>
                    <div className="text-xs text-muted-foreground">{note}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="py-14 md:py-24 [overflow-x:clip] scroll-mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">{t('roadmap_title')}</h2>
            <p className="text-lg text-muted-foreground">{t('roadmap_desc')}</p>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* gradient progress line — centered on circles (circle height 2.75rem = 44px, so center = 22px = 1.375rem) */}
            <div className="hidden md:block absolute top-[1.375rem] left-0 right-0 h-px">
              <div className="w-full h-full bg-gradient-to-r from-green-400/60 via-primary/40 to-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 items-stretch">
              {[
                { phase: t('rm1_phase'), title: t('rm1_title'), desc: t('rm1_desc'), active: true, label: t('rm1_label') },
                { phase: t('rm2_phase'), title: t('rm2_title'), desc: t('rm2_desc') },
                { phase: t('rm3_phase'), title: t('rm3_title'), desc: t('rm3_desc') },
                { phase: t('rm4_phase'), title: t('rm4_title'), desc: t('rm4_desc'), highlight: true, label: t('rm4_label') },
                { phase: t('rm5_phase'), title: t('rm5_title'), desc: t('rm5_desc') },
              ].map((step, i) => (
                <div key={i}
                  className="flex flex-col items-center md:items-start text-center md:text-left">

                  {/* numbered circle */}
                  <div className="relative flex items-center justify-center mb-5 md:mb-6 z-10">
                    <div className={`w-[2.75rem] h-[2.75rem] rounded-full flex items-center justify-center font-black text-sm z-10 relative border-2
                      ${step.active
                        ? 'bg-green-400/15 border-green-400 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.4)]'
                        : step.highlight
                          ? 'bg-yellow-400/15 border-yellow-400 text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.35)]'
                          : 'bg-primary/10 border-primary/40 text-primary'}`}>
                      {step.active && <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20" />}
                      {i + 1}
                    </div>
                  </div>

                  {/* card — flex-1 ensures equal heights within the row */}
                  <div className={`glass-card p-5 rounded-2xl w-full border transition-all flex flex-col flex-1
                    ${step.highlight ? 'border-yellow-500/30 bg-yellow-500/4' : step.active ? 'border-green-500/30 bg-green-500/4' : 'border-white/8'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0
                        ${step.active ? 'bg-green-400' : step.highlight ? 'bg-yellow-400' : 'bg-primary'}`} />
                      <div className={`text-xs font-bold tracking-wider uppercase
                        ${step.highlight ? 'text-yellow-400' : step.active ? 'text-green-400' : 'text-primary'}`}>{step.phase}</div>
                    </div>
                    <h3 className="text-base font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{step.desc}</p>
                    {step.highlight && (
                      <div className="mt-3 flex items-center justify-center md:justify-start gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span className="text-yellow-400 text-xs font-semibold">{step.label}</span>
                      </div>
                    )}
                    {step.active && (
                      <div className="mt-3 flex items-center justify-center md:justify-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                        <span className="text-green-400 text-xs font-semibold">{step.label}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-center mb-12">{t('faq_title')}</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: t('faq1_q'), a: t('faq1_a') },
              { q: t('faq2_q'), a: t('faq2_a') },
              { q: t('faq3_q'), a: t('faq3_a') },
              { q: t('faq4_q'), a: t('faq4_a') },
              { q: t('faq5_q'), a: t('faq5_a') },
              { q: t('faq6_q'), a: t('faq6_a') },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass-card border border-white/8 px-6 rounded-xl overflow-hidden">
                <AccordionTrigger className="text-base font-medium hover:text-primary transition-colors py-4 text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-10 relative overflow-hidden z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/4 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">

          {/* Brand row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <img src={logoPath} alt="Logo" className="w-8 h-8 object-contain" />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }} className="text-lg text-white">Trends</span>
              <span className="hidden sm:block text-muted-foreground text-xs">·</span>
              <span className="hidden sm:block text-xs text-muted-foreground">{lang === 'ru' ? 'Первый Reels-фид внутри Telegram' : 'First Reels feed inside Telegram'}</span>
            </div>
            <div className="flex gap-2">
              <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                href="https://t.me/Trends_ibot" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg glass-card border border-white/10 flex items-center justify-center text-primary hover:border-primary/40 transition-colors">
                <Send className="w-3.5 h-3.5" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                href="https://t.me/Trends_ibot?startapp" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg glass-card border border-white/10 flex items-center justify-center text-secondary hover:border-secondary/40 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
              </motion.a>
            </div>
          </div>

          {/* Links row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* Navigation */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-3 opacity-60">{t('footer_nav')}</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-3 opacity-60">{t('footer_docs')}</h4>
              <ul className="space-y-2">
                {DOCS.map(doc => (
                  <li key={doc.id}>
                    <button
                      onClick={() => setLegalDoc(doc.id)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
                    >
                      {lang === 'ru' ? doc.titleRu : doc.titleEn}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-3 opacity-60">{t('footer_contacts')}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://t.me/Trends_ibot?startapp" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                    <ExternalLink className="w-3 h-3 text-primary" /> {t('footer_open_mvp')}
                  </a>
                </li>
                <li>
                  <Link href="/cabinet" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                    <Wallet className="w-3 h-3 text-primary" /> {t('footer_cabinet')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/6" style={{ background: "rgba(4, 6, 14, 0.97)" }}>
        <div className="container mx-auto px-4 py-5 flex flex-col gap-3 text-xs text-muted-foreground">
          {/* Top row: copyright + doc links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <span>© {new Date().getFullYear()} Trends. {t('footer_copyright')}</span>
            <div className="flex flex-wrap justify-center gap-4">
              {DOCS.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setLegalDoc(doc.id)}
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <doc.icon className="w-3 h-3" />
                  {lang === 'ru' ? doc.titleRu : doc.titleEn}
                </button>
              ))}
            </div>
          </div>
          {/* Bottom row: disclaimer */}
          <p className="text-center opacity-50 leading-relaxed">{t('footer_disclaimer')}</p>
        </div>
      </div>

      <InvestmentModal isOpen={isInvestOpen} onClose={() => setIsInvestOpen(false)} defaultPackage={selectedPkg} />
      <LegalModal docId={legalDoc} lang={lang} onClose={() => setLegalDoc(null)} />
    </div>
  );
}
