import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InvestmentModal } from "@/components/InvestmentModal";
import { SceneBackground } from "@/components/SceneBackground";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  ArrowRight, CheckCircle2, PlaySquare, TrendingUp, Users, Smartphone,
  BarChart3, Target, ShoppingBag, Gift, Wallet, ExternalLink,
  Network, Coins, ChevronRight, DollarSign, UserPlus, Users2,
  Menu, X, Send, MessageCircle, Star, Shield, Zap, Crown,
  Mail, Globe, FileText, Lock, Code2, Megaphone, Server
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
  { title: "RevShare от монетизации платформы", desc: "20% всей рекламной выручки (7 источников) идёт напрямую в Investor Pool. Ежедневные и ежемесячные выплаты в USDT прямо на ваш кошелёк.", color: "text-primary", gradFrom: "from-primary/20", gradTo: "to-secondary/10", Icon: DollarSign, label: "01 / Ежедневный доход" },
  { title: "Собственный источник трафика", desc: "Специальные условия продвижения для инвесторов + приоритет в алгоритме. Используйте мощь платформы для своих проектов и каналов.", color: "text-secondary", gradFrom: "from-secondary/20", gradTo: "to-primary/5", Icon: TrendingUp, label: "02" },
  { title: "Партнёрская программа", desc: "Получайте до 20% от инвестиций вашей структуры на 5 уровней в глубину (10%–5%–3%–1%–1%). Постройте источник пассивного дохода.", color: "text-green-400", gradFrom: "from-green-500/20", gradTo: "to-teal-500/5", Icon: Network, label: "03" },
  { title: "Начисление токенов $TRND", desc: "Ранняя аллокация токенов с потенциалом кратного роста при листинге. Встроенный vesting для защиты цены токена.", color: "text-yellow-400", gradFrom: "from-yellow-500/20", gradTo: "to-orange-500/5", Icon: Coins, label: "04" },
  { title: "Exit Upside × 20 – × 30", desc: "При продаже платформы стратегическому покупателю (оценка $200M–$500M) ваша доля принесёт сверхприбыль — от × 20 до × 30 от вложенного.", color: "text-primary", gradFrom: "from-primary/20", gradTo: "to-purple-500/10", Icon: Crown, label: "05" },
];

function AdvantageCard({ item, index, variants }: { item: typeof ADVANTAGES[0]; index: number; variants: Variants }) {
  const { Icon } = item;
  return (
    <motion.div initial="visible" animate="visible"
      variants={variants}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="glass-card rounded-[2rem] overflow-hidden group cursor-default relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradFrom} ${item.gradTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10 p-5 md:p-8 lg:p-10 h-full flex flex-col">
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className={`w-6 h-6 md:w-7 md:h-7 ${item.color}`} />
          </div>
          <div className={`text-5xl md:text-6xl font-black ${item.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 leading-none`}>{item.label}</div>
        </div>
        <div className={`text-xs font-black tracking-widest uppercase mb-3 ${item.color}`}>{item.label}</div>
        <h3 className="text-xl md:text-2xl font-black mb-3">{item.title}</h3>
        <p className="text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
      </div>
    </motion.div>
  );
}

function AdvantagesGrid({ openInvest: _openInvest }: { openInvest: (pkg?: string) => void }) {
  const first = ADVANTAGES[0];
  const { Icon: Icon0 } = first;
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Item 1 — full width */}
      <motion.div initial="visible" animate="visible" variants={slideUp}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        className="glass-card rounded-[2rem] overflow-hidden group cursor-default relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${first.gradFrom} ${first.gradTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative z-10 p-5 md:p-10 lg:p-14 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Icon0 className={`w-8 h-8 md:w-10 md:h-10 ${first.color}`} />
          </div>
          <div className="flex-1">
            <div className={`text-xs font-black tracking-widest uppercase mb-3 ${first.color}`}>{first.label}</div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-4">{first.title}</h3>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed">{first.desc}</p>
          </div>
          <div className={`text-[120px] font-black ${first.color} opacity-[0.06] group-hover:opacity-[0.15] transition-opacity duration-500 shrink-0 hidden lg:block leading-none`}>01</div>
        </div>
      </motion.div>

      {/* Items 2 & 3 — two columns */}
      <div className="grid md:grid-cols-2 gap-5">
        <AdvantageCard item={ADVANTAGES[1]} index={1} variants={fadeLeft} />
        <AdvantageCard item={ADVANTAGES[2]} index={2} variants={fadeRight} />
      </div>

      {/* Items 4 & 5 — two columns */}
      <div className="grid md:grid-cols-2 gap-5">
        <AdvantageCard item={ADVANTAGES[3]} index={3} variants={fadeLeft} />
        <AdvantageCard item={ADVANTAGES[4]} index={4} variants={fadeRight} />
      </div>
    </div>
  );
}

const TARGET_AMOUNT = 75000;
const TARGET_INVESTORS = 13;
const GOAL = 1_000_000;
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

const PACKAGES_DATA = [
  {
    id: "founder1", name: "Основателей 1", price: 100, monthly: 0,
    exit: "–", tokens: "100", shares: "0",
    tagline: "Войди в экосистему",
    icon: Zap,
    color: "text-sky-400", border: "border-sky-400/20", glow: "",
    features: [
      "Рекламный буст $200 внутри Trends",
      "x2 добыча токенов $TRND",
      "3-уровневая партнёрская программа",
      "No Ads Forever",
    ],
  },
  {
    id: "founder2", name: "Основателей 2", price: 250, monthly: 5,
    exit: "$2K – $5K", tokens: "250", shares: "0.26",
    tagline: "Первые доли RevShare",
    icon: Star,
    color: "text-secondary", border: "border-secondary/30", glow: "",
    features: [
      "0.26 доли в RevShare пуле (20% прибыли)",
      "Рекламный буст $500",
      "Партнёрская программа без лимита глубины",
      "No Ads Forever",
    ],
  },
  {
    id: "founder3", name: "Основателей 3", price: 1000, monthly: 20,
    exit: "$10K – $25K", tokens: "1,000", shares: "1.3",
    tagline: "Лучший вход на стадии Alpha",
    icon: Shield,
    recommended: true,
    color: "text-primary", border: "border-primary/40", glow: "shadow-[0_0_40px_rgba(0,212,255,0.18)]",
    features: [
      "1.3 доли в RevShare пуле",
      "Рекламный буст $2,000",
      "Founder Identity: золотая рамка + бейдж",
      "DAO голосование за функции",
    ],
  },
  {
    id: "founder4", name: "Основателей 4", price: 5000, monthly: 100,
    exit: "$75K – $180K", tokens: "5,000", shares: "10.04",
    tagline: "Alpha-Bonus доля",
    icon: Crown,
    color: "text-yellow-400", border: "border-yellow-400/20", glow: "shadow-[0_0_30px_rgba(250,204,21,0.12)]",
    features: [
      "10.04 доли в RevShare пуле",
      "Рекламный буст $10,000",
      "Blue Checkmark: приоритет в алгоритме",
      "Все привилегии Пакета 3",
    ],
  },
  {
    id: "founder5", name: "Основателей 5", price: 25000, monthly: 500,
    exit: "$500K – $1.2M", tokens: "25,000", shares: "65",
    tagline: "Стратегический узел",
    icon: TrendingUp,
    color: "text-orange-400", border: "border-orange-400/20", glow: "shadow-[0_0_30px_rgba(251,146,60,0.10)]",
    features: [
      "65 долей в RevShare пуле",
      "Рекламный буст $50,000",
      "Early Buyback Rights при Exit",
      "Network Node + 0% комиссия вывода",
    ],
  },
  {
    id: "founder6", name: "Основателей 6", price: 100000, monthly: 2000,
    exit: "$2M – $4.5M", tokens: "100,000", shares: "250",
    tagline: "Legendary статус",
    icon: Network,
    color: "text-amber-400", border: "border-amber-400/20", glow: "shadow-[0_0_40px_rgba(251,191,36,0.12)]",
    features: [
      "250 долей — Legendary Share",
      "Global Revenue Pool: 2% выручки платформы",
      "Рекламный буст $200,000",
      "Advisory Board: место в совете",
    ],
  },
];

const NAV_LINKS = [
  { href: "#problem", label: "О проекте" },
  { href: "#monetization", label: "Монетизация" },
  { href: "#investors", label: "Инвесторам" },
  { href: "#roadmap", label: "Roadmap" },
];

export default function Landing() {
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("founder3");
  const [users] = useState(7780);
  const [views] = useState(2550);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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

          <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
            ))}
          </div>

          <div className="hidden md:flex gap-3">
            <Link href="/cabinet">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary font-semibold">Войти в кабинет</Button>
            </Link>
            <motion.div whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.04 }}>
              <Button onClick={() => openInvest()} className="btn-grad btn-3d text-background font-bold rounded-xl">
                Инвестировать
              </Button>
            </motion.div>
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
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
              className="md:hidden overflow-hidden border-t border-white/10"
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
                  <Link href="/cabinet" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10">Войти в кабинет</Button>
                  </Link>
                  <Button onClick={() => { openInvest(); setMobileMenuOpen(false); }}
                    className="w-full btn-grad btn-3d font-bold">
                    Инвестировать
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
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold">Pre-Seed</div>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-sm">$1 000 000 целевой объём</div>
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> MVP готов
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
              className="relative z-10 max-h-[62vh] sm:max-h-[65vh] lg:max-h-[85vh] w-full object-contain drop-shadow-2xl"
            />
          </motion.div>


          {/* TEXT — third on mobile, first on desktop */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6 lg:space-y-8 order-3 lg:order-1">
            <div className="hidden lg:flex flex-wrap gap-3">
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold">Pre-Seed</div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-sm">$1 000 000 целевой объём</div>
              <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> MVP готов
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Trends — первый <span className="text-gradient">Reels</span> внутри Telegram
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Войдите на стадии Pre-Seed и получите прямой доступ к рынку из 1 миллиарда пользователей Telegram, у которых до сих пор нет алгоритмической видеоленты.
            </p>

            <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground font-semibold">Цель сбора — маркетинг и инфраструктура Trends.</span>{" "}
                Привлечённые средства направляются на масштабирование платформы: привлечение аудитории, продвижение и развитие серверной инфраструктуры.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <MagneticButton onClick={() => openInvest()} className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 text-lg btn-grad btn-3d font-bold rounded-xl pointer-events-none w-full">
                  Инвестировать сейчас <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </MagneticButton>
              <Link href="/cabinet" className="w-full sm:w-auto">
                <MagneticButton className="w-full">
                  <Button variant="outline" size="lg"
                    className="h-14 px-8 text-lg border-primary/30 hover:bg-primary/10 hover:border-primary/50 rounded-xl w-full btn-3d-outline pointer-events-none">
                    Войти в кабинет
                  </Button>
                </MagneticButton>
              </Link>
            </div>

          </motion.div>

        </div>
        </div>
      </section>

      {/* FUNDRAISING PROGRESS */}
      <section className="py-14 md:py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm mb-5">
                <DollarSign className="w-4 h-4" />
                Прозрачность финансирования
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                Куда идут <span className="text-gradient">деньги</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Мы уже вложили $75 000 в разработку продукта. Инвестиции раунда направляются на масштабирование.
              </p>
            </div>

            {/* Progress bar */}
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 md:p-8 mb-6">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-3xl md:text-4xl font-black text-green-400">$75 000</div>
                  <div className="text-sm text-muted-foreground mt-1">уже потрачено на разработку</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-black text-foreground">$1 000 000</div>
                  <div className="text-sm text-muted-foreground mt-1">целевой объём Pre-Seed</div>
                </div>
              </div>

              {/* Bar */}
              <div className="relative h-4 rounded-full bg-white/8 overflow-hidden mb-3">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: "linear-gradient(90deg, #00D4FF, #7B5EFF)" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "7.5%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                {/* Marker at 7.5% */}
                <div className="absolute inset-y-0 left-[7.5%] flex items-center">
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-primary shadow-lg shadow-primary/50 -translate-x-1/2" />
                </div>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>7.5% собрано</span>
                <span>осталось собрать: $925 000</span>
              </div>
            </div>

            {/* Spend breakdown */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Code2,
                  label: "Разработка MVP",
                  amount: "$75 000",
                  note: "уже потрачено",
                  color: "text-green-400",
                  bg: "bg-green-500/10 border-green-500/20",
                  iconBg: "bg-green-500/15 text-green-400",
                  badge: "Выполнено",
                  badgeColor: "bg-green-500/20 text-green-400",
                },
                {
                  icon: Server,
                  label: "Инфраструктура",
                  amount: "$200 000",
                  note: "серверы и безопасность",
                  color: "text-secondary",
                  bg: "bg-secondary/5 border-secondary/20",
                  iconBg: "bg-secondary/15 text-secondary",
                  badge: "Pre-Seed",
                  badgeColor: "bg-secondary/20 text-secondary",
                },
                {
                  icon: Megaphone,
                  label: "Маркетинг",
                  amount: "$600 000",
                  note: "привлечение аудитории",
                  color: "text-primary",
                  bg: "bg-primary/5 border-primary/20",
                  iconBg: "bg-primary/15 text-primary",
                  badge: "Pre-Seed",
                  badgeColor: "bg-primary/20 text-primary",
                },
                {
                  icon: Users,
                  label: "Команда",
                  amount: "$125 000",
                  note: "расширение штата",
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
      </section>

      {/* WHAT IS TRENDS */}
      <section className="py-14 md:py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-6 order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-black">
                Что такое <span className="text-gradient">Trends</span>?
              </h2>
              <div className="space-y-5 leading-relaxed">
                <p className="text-foreground font-semibold text-lg">Trends — первая в Telegram платформа коротких видео в формате Reels.</p>
                <div className="space-y-3">
                  {[
                    {
                      label: "Пользователи",
                      icon: Users,
                      accent: "border-l-primary bg-primary/5",
                      iconColor: "text-primary bg-primary/15",
                      labelColor: "text-primary",
                      text: "смотрят персонализированную ленту коротких видео прямо внутри Telegram и получают токен внимания TRND за вовлечённость и активность.",
                    },
                    {
                      label: "Авторы",
                      icon: PlaySquare,
                      accent: "border-l-secondary bg-secondary/5",
                      iconColor: "text-secondary bg-secondary/15",
                      labelColor: "text-secondary",
                      text: "публикуют контент в ленте, получают органический охват, новую аудиторию и эффективное продвижение своих Telegram-каналов.",
                    },
                    {
                      label: "Telegram",
                      icon: Send,
                      accent: "border-l-blue-400 bg-blue-400/5",
                      iconColor: "text-blue-400 bg-blue-400/15",
                      labelColor: "text-blue-400",
                      text: "получает инструмент для развития собственной экосистемы: рекомендации каналов, рост вовлечённости и удержание пользователей внутри платформы.",
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
              <div className="relative inline-flex justify-center items-center" style={{ height: 'clamp(480px, 85vw, 580px)' }}>
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

      {/* PROBLEM → SOLUTION */}
      <section id="problem" className="py-14 md:py-24 relative z-10 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div initial="visible" animate="visible" variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">Огромный рынок пуст</h2>
            <p className="text-lg text-muted-foreground">Telegram вырос до 1 миллиарда пользователей, но в нём до сих пор нет главного формата потребления контента — бесконечной ленты коротких видео.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial="visible" animate="visible" variants={fadeLeft}
              className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-8">Telegram сейчас</h3>
              <ul className="space-y-6">
                {[
                  "Нет алгоритмической ленты рекомендаций",
                  "Сложно находить новые каналы и авторов",
                  "Неудобно смотреть видео (нужно переходить в каналы)"
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
              <h3 className="text-2xl font-bold mb-8 text-primary">Trends решает</h3>
              <ul className="space-y-6">
                {[
                  "Бесконечная вертикальная лента (Reels/TikTok) прямо в Mini App",
                  "Умный алгоритм рекомендаций на базе AI",
                  "Бесшовный переход внутри экосистемы Telegram"
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
              <div className="text-muted-foreground font-medium uppercase tracking-wider">Пользователей Telegram</div>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block" />
            <div>
              <div className="text-5xl font-black text-gradient mb-2">500M+</div>
              <div className="text-muted-foreground font-medium uppercase tracking-wider">Юзеров Mini Apps</div>
            </div>
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
                ПРОДУКТ УЖЕ РАБОТАЕТ
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">MVP готов и <span className="text-gradient">запущен</span></h2>
              <p className="text-base md:text-xl text-muted-foreground">Мы не продаём идею. Мы привлекаем капитал для масштабирования уже работающей инфраструктуры.</p>

              <div className="space-y-4">
                {[
                  "Вертикальная лента стабильна и оптимизирована под Mini App",
                  "Инфраструктура готова к нагрузкам в миллионы DAU",
                  "Первые авторы уже загружают контент и получают охваты"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 glass-card p-4 rounded-2xl">
                    <CheckCircle2 className="w-7 h-7 text-green-400 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div>
                <MagneticButton onClick={() => openInvest()}>
                  <Button className="mt-4 btn-grad btn-3d h-14 px-8 text-lg font-bold rounded-xl pointer-events-none">
                    Стать инвестором проекта
                  </Button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT FULL */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">Продукт <span className="text-gradient">Trends</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Полноценная лента вертикальных видео прямо внутри Telegram — контент от тысяч авторов, персонализированная выдача.</p>
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
                      Открыть MVP Trends
                    </Button>
                  </motion.div>
                </a>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MONETIZATION */}
      <section id="monetization" className="py-14 md:py-24 relative z-10 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">7 источников монетизации</h2>
            <p className="text-lg text-muted-foreground">Диверсифицированная бизнес-модель — рост любого источника усиливает общую экономику платформы.</p>
          </div>

          <motion.div initial="visible" animate="visible" variants={fadeScale} className="mb-6">
            <div className="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-6 right-8 text-8xl font-black text-primary/6 select-none">01</div>
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <Target className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl md:text-3xl font-bold">Реклама в ленте</h3>
                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">Основной</span>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-4">Проверенная модель монетизации TikTok, Instagram Reels и YouTube Shorts — адаптированная под экосистему Telegram.</p>
                  <div className="flex flex-wrap gap-3">
                    {["CPM", "CPV", "CPC", "CPA"].map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-sm border border-primary/20">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: TrendingUp, num: "02", title: "Boost-продвижение", desc: "Платное усиление охватов для авторов и брендов — приоритет в ленте" },
              { icon: Gift, num: "03", title: "Спонсорские интеграции", desc: "Брендированные челленджи, спецпроекты, фиксированные бюджеты" },
              { icon: Wallet, num: "04", title: "Цифровые донаты", desc: "Комиссия с транзакций между зрителями и авторами" },
              { icon: BarChart3, num: "05", title: "Аналитика и данные", desc: "B2B-продажа агрегированной аналитики брендам" },
              { icon: Smartphone, num: "06", title: "Таргет-баннер", desc: "Баннер внизу экрана по интересам — не перекрывает видео" },
              { icon: ShoppingBag, num: "07", title: "E-commerce в ленте", desc: "Оффер товара + кнопка «Купить» → deep-link на маркетплейс" }
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl group relative overflow-hidden">
                <div className="absolute top-4 right-5 text-5xl font-black text-primary/6 select-none group-hover:text-primary/12 transition-colors">{item.num}</div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 INVESTOR ADVANTAGES */}
      <section id="investors" className="py-16 md:py-24 lg:py-32 relative z-10 [overflow-x:clip] scroll-mt-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6">5 преимуществ инвестора</h2>
            <p className="text-base md:text-xl text-muted-foreground">Беспрецедентные условия для тех, кто заходит на стадии Pre-Seed. Инвестор зарабатывает вместе с платформой каждый день.</p>
          </div>

          <AdvantagesGrid openInvest={openInvest} />
        </div>
      </section>

      {/* INVESTMENT PACKAGES */}
      <section className="py-14 md:py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">Инвестиционные пакеты</h2>
            <p className="text-lg text-muted-foreground">Выберите свой уровень участия. Все пакеты включают RevShare, токены $TRND и партнёрскую программу.</p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
            {PACKAGES_DATA.map((pkg, i) => (
              <motion.div key={pkg.id} initial="visible" animate="visible" variants={fadeIn}
                whileHover={{ y: pkg.recommended ? -6 : -4, transition: { duration: 0.25 } }}
                className={`relative flex flex-col rounded-3xl border transition-colors ${pkg.recommended
                  ? `glass-pkg-active xl:-translate-y-4 ${pkg.border} ${pkg.glow}`
                  : `glass-card ${pkg.border}`
                }`}>

                <div className="p-7 flex flex-col flex-1">
                  {/* RECOMMENDED BADGE — inside card */}
                  {pkg.recommended && (
                    <div className="flex justify-center mb-5 -mt-1">
                      <motion.div
                        animate={{ boxShadow: ["0 4px 20px rgba(0,212,255,0.35)", "0 4px 30px rgba(123,94,255,0.55)", "0 4px 20px rgba(0,212,255,0.35)"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-gradient-to-r from-primary to-secondary text-background text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap"
                      >
                        ★ РЕКОМЕНДУЕМ ★
                      </motion.div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pkg.recommended ? 'bg-primary/20' : 'bg-white/5'}`}>
                      <pkg.icon className={`w-5 h-5 ${pkg.color}`} />
                    </div>
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">{pkg.tagline}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className={`text-4xl font-black ${pkg.recommended ? 'text-primary' : 'text-foreground'}`}>
                      ${pkg.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">единовременная инвестиция</div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-7">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${pkg.color}`} />
                        <span className="text-sm text-muted-foreground leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Key metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-6 p-3 rounded-xl bg-white/3 border border-white/8">
                    <div className="text-center">
                      <div className={`text-sm font-black ${pkg.color}`}>~${pkg.monthly.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">RevShare/мес</div>
                    </div>
                    <div className="text-center border-l border-white/8">
                      <div className="text-sm font-black text-green-400">{pkg.exit}</div>
                      <div className="text-[10px] text-muted-foreground">Exit потенциал</div>
                    </div>
                  </div>

                  <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
                    <Button
                      onClick={() => openInvest(pkg.id)}
                      className={`w-full h-12 text-base font-bold rounded-xl btn-3d ${pkg.recommended
                        ? 'btn-grad'
                        : `bg-transparent border-2 ${pkg.border} ${pkg.color} hover:bg-white/5`
                      }`}
                    >
                      Инвестировать
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MLM */}
      <section className="py-14 md:py-24 relative z-10 [overflow-x:clip]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-green-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm mb-6">
              <Network className="w-4 h-4" />
              ПАРТНЁРСКАЯ ПРОГРАММА
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-6">Партнёрская программа — зарабатывай на привлечении</h2>
            <p className="text-lg text-muted-foreground">Приглашайте новых инвесторов и получайте процент от их вложений на 5 уровней вглубь.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="space-y-3">
              {[
                { level: "Уровень 1", pct: "10%", desc: "Прямые приглашённые вами", color: "from-primary to-primary/70", textColor: "text-primary", w: "100%" },
                { level: "Уровень 2", pct: "5%", desc: "Их партнёры", color: "from-secondary to-secondary/70", textColor: "text-secondary", w: "80%" },
                { level: "Уровень 3", pct: "3%", desc: "Третье звено сети", color: "from-blue-400 to-blue-400/70", textColor: "text-blue-400", w: "60%" },
                { level: "Уровень 4", pct: "1%", desc: "Четвёртое звено", color: "from-cyan-400 to-cyan-400/70", textColor: "text-cyan-400", w: "40%" },
                { level: "Уровень 5", pct: "1%", desc: "Пятое звено", color: "from-teal-400 to-teal-400/70", textColor: "text-teal-400", w: "25%" },
              ].map((lvl, i) => (
                <motion.div key={i} initial="visible" animate="visible" variants={fadeIn}
                  className="glass-card p-5 rounded-2xl flex items-center gap-5">
                  <div className={`text-2xl font-black ${lvl.textColor} w-14 shrink-0`}>{lvl.pct}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{lvl.level}</span>
                      <span className="text-sm text-muted-foreground hidden sm:block">{lvl.desc}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: lvl.w }} viewport={{ once: true, amount: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${lvl.color}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* MLM Example — simplified */}
          <motion.div initial="visible" animate="visible" variants={fadeIn}
            className="glass-card p-8 md:p-10 rounded-3xl border border-green-500/20 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold">Пример: Пакет Основателей 5 — $25,000</h3>
                <p className="text-sm text-muted-foreground">Вы вложили $25,000 и начали приглашать партнёров</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                {
                  step: "01", icon: UserPlus, color: "text-primary", bg: "bg-primary/10",
                  action: "Вы пригласили 5 друзей", detail: "Каждый вложил по $25,000",
                  calc: "5 × $25,000 × 10%", result: "+$12,500", resultColor: "text-primary"
                },
                {
                  step: "02", icon: Users2, color: "text-secondary", bg: "bg-secondary/10",
                  action: "Каждый из них привёл ещё 3 человека", detail: "Каждый вложил по $5,000",
                  calc: "15 × $5,000 × 5%", result: "+$3,750", resultColor: "text-secondary"
                },
                {
                  step: "03", icon: Network, color: "text-blue-400", bg: "bg-blue-400/10",
                  action: "3-й, 4-й и 5-й уровни растут сами", detail: "Небольшой % с каждого участника вашей сети",
                  calc: "уровни 3–5 × 3%–1%–1%", result: "+$2,500", resultColor: "text-blue-400"
                },
              ].map((row, i) => (
                <div key={i} className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className={`w-10 h-10 rounded-xl ${row.bg} flex items-center justify-center shrink-0`}>
                    <row.icon className={`w-5 h-5 ${row.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{row.action}</div>
                    <div className="text-sm text-muted-foreground">{row.detail} · <span className="font-mono">{row.calc}</span></div>
                  </div>
                  <div className={`text-2xl font-black ${row.resultColor} shrink-0`}>{row.result}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl glass-card">
              <div className="flex-1 text-center md:text-left">
                <div className="text-sm text-muted-foreground mb-1">Итого от партнёрской сети</div>
                <div className="text-5xl font-black text-green-400">$18,750</div>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block" />
              <div className="text-center md:text-left">
                <div className="text-sm text-muted-foreground mb-1">Плюс ваш RevShare каждый месяц</div>
                <div className="text-3xl font-black text-primary">+$500 / мес</div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Реферальная ссылка доступна в личном кабинете. Выплаты в USDT в течение 48 часов.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="py-14 md:py-24 [overflow-x:clip] scroll-mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">Roadmap</h2>
            <p className="text-lg text-muted-foreground">Запуск в 2026 — путь к глобальному масштабу</p>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* gradient progress line — centered on circles (circle height 2.75rem = 44px, so center = 22px = 1.375rem) */}
            <div className="hidden md:block absolute top-[1.375rem] left-0 right-0 h-px">
              <div className="w-full h-full bg-gradient-to-r from-green-400/60 via-primary/40 to-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 items-stretch">
              {[
                { phase: "Июль 2026", title: "Public Launch", desc: "Публичный запуск MVP, онбординг первых 1,000 криэйторов, старт монетизации.", active: true },
                { phase: "Q3 2026", title: "Growth Phase", desc: "Запуск рекламного кабинета, интеграция с TON, активация RevShare для инвесторов." },
                { phase: "Q4 2026", title: "Scale", desc: "Агрессивный маркетинг, масштабирование аудитории, выход на международные рынки." },
                { phase: "2027 — 10M", title: "Листинг $TRND", desc: "При 10M пользователей — листинг токена. Ранние инвесторы получают максимальную аллокацию.", highlight: true },
                { phase: "2027+", title: "Global Expansion", desc: "Выход на мировые рынки, e-commerce, подготовка к Exit или Series A." },
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
                        <span className="text-yellow-400 text-xs font-semibold">Ключевой milestone</span>
                      </div>
                    )}
                    {step.active && (
                      <div className="mt-3 flex items-center justify-center md:justify-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                        <span className="text-green-400 text-xs font-semibold">Текущий этап</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM — 3 members */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">Команда</h2>
            <p className="text-lg text-muted-foreground">Опытные специалисты с глубокой экспертизой в Telegram, IT и продукте</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                initials: "П", name: "Поляков Михаил", role: "Основатель / CEO",
                roleColor: "text-primary",
                desc: "10+ лет в IT, основатель студии разработки и бывший владелец сети Telegram-каналов. Глубоко понимает экосистему Telegram, механику органического роста и монетизацию контента.",
                tags: ["10+ лет в IT", "Telegram-сети", "Mini Apps"],
                avatarColor: "bg-primary/15 border-primary/40",
                textColor: "text-primary"
              },
              {
                initials: "Д", name: "Долгов Николай", role: "Co-Founder / PdM",
                roleColor: "text-secondary",
                desc: "Продуктовая стратегия и развитие. Отвечает за видение продукта, roadmap платформы и взаимодействие с инвесторами.",
                tags: ["Product", "Strategy", "Investor Relations"],
                avatarColor: "bg-secondary/15 border-secondary/40",
                textColor: "text-secondary"
              },
              {
                initials: "Ч", name: "Чаунный Владимир", role: "Backend Developer",
                roleColor: "text-yellow-400",
                desc: "Senior/FullStack-разработчик, 5+ лет в IT и банковском секторе. Отвечает за надёжность и масштабируемость инфраструктуры.",
                tags: ["Backend", "Infrastructure", "5+ лет в IT"],
                avatarColor: "bg-yellow-500/15 border-yellow-500/40",
                textColor: "text-yellow-400"
              },
            ].map((member, i) => (
              <motion.div key={i} initial="visible" animate="visible" variants={fadeIn}
                className="glass-card p-7 rounded-3xl border border-white/10 hover:border-primary/25 transition-all">
                <div className={`w-16 h-16 ${member.avatarColor} rounded-2xl border-2 flex items-center justify-center mb-5`}>
                  <span className={`text-2xl font-black ${member.textColor}`}>{member.initials}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className={`${member.roleColor} font-semibold text-sm mb-4`}>{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{member.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {member.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-lg bg-white/5 text-muted-foreground text-xs font-medium border border-white/10">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-black text-center mb-12">Вопросы и ответы</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "Как инвестировать?", a: "Выберите подходящий пакет, подключите кошелёк TON или MetaMask в личном кабинете и подтвердите транзакцию. Средства автоматически зачислятся на ваш баланс." },
              { q: "На что идут привлечённые средства?", a: "100% привлечённого капитала направляется на маркетинг и развитие инфраструктуры Trends: привлечение авторов и аудитории, performance-реклама, серверные мощности и масштабирование платформы." },
              { q: "Когда начнутся выплаты RevShare?", a: "Выплаты RevShare начнутся в фазе Growth (Q3 2026) после полноценного запуска рекламного кабинета и достижения плановых показателей по DAU." },
              { q: "Как работает партнёрская программа?", a: "Вы получаете процент от инвестиций привлечённых вами партнёров до 5 уровней в глубину: 10% с первой линии, 5% со второй, 3% с третьей, 1% с четвёртой и 1% с пятой." },
              { q: "Что такое токены $TRND?", a: "Это utility и governance-токен экосистемы Trends. Инвесторы ранних стадий получают аллокацию токенов, которые будут листиться при достижении 10M аудитории. Встроенный vesting защищает цену от обвала." },
              { q: "Как осуществляется вывод средств?", a: "Вывод средств доступен в любой момент из личного кабинета при достижении минимальной суммы в $100. Выплаты производятся в USDT на привязанный кошелёк." },
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
      <footer className="border-t border-white/8 pt-20 pb-8 relative overflow-hidden z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />


        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

            {/* Brand */}
            <div className="space-y-5 lg:col-span-1">
              <div className="flex items-center gap-3">
                <img src={logoPath} alt="Logo" className="w-9 h-9 object-contain" />
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }} className="text-xl text-white">Trends</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Первый Reels-фид внутри Telegram. Инвестируй в платформу для 1 миллиарда пользователей Telegram.
              </p>
              <div className="flex gap-3">
                <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  href="https://t.me/Trends_ibot" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center text-primary hover:border-primary/40 transition-colors">
                  <Send className="w-4 h-4" />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  href="https://t.me/Trends_ibot?startapp" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center text-secondary hover:border-secondary/40 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  href="https://t.me/Trends_ibot" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center text-muted-foreground hover:border-white/25 transition-colors">
                  <Globe className="w-4 h-4" />
                </motion.a>
              </div>
              {/* Key stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="glass-card p-3 rounded-xl text-center">
                  <div className="text-lg font-black text-primary">$75K</div>
                  <div className="text-[10px] text-muted-foreground">Собрано</div>
                </div>
                <div className="glass-card p-3 rounded-xl text-center">
                  <div className="text-lg font-black text-green-400">13</div>
                  <div className="text-[10px] text-muted-foreground">Инвесторов</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-5">
              <h4 className="font-bold text-foreground tracking-wide">Навигация</h4>
              <ul className="space-y-3">
                {[
                  { href: "#problem", label: "О проекте" },
                  { href: "#monetization", label: "Монетизация" },
                  { href: "#investors", label: "Инвесторам" },
                  { href: "#roadmap", label: "Roadmap" },
                  { href: "#faq", label: "FAQ" },
                ].map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>


            {/* Contacts & Legal */}
            <div className="space-y-5 lg:col-start-4">
              <h4 className="font-bold text-foreground tracking-wide">Контакты</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://t.me/Trends_ibot?startapp" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-primary" /> Открыть MVP
                  </a>
                </li>
                <li>
                  <Link href="/cabinet" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5 text-primary" /> Личный кабинет
                  </Link>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </footer>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/6" style={{ background: "rgba(4, 6, 14, 0.97)" }}>
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Trends. Все права защищены.</span>
          </div>
          <div className="text-center opacity-60 max-w-md">Средства привлекаются на маркетинг и инфраструктуру платформы. Инвестирование сопряжено с рисками. Не является публичной офертой.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
              <FileText className="w-3 h-3" /> Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3" /> Privacy
            </a>
          </div>
        </div>
      </div>

      <InvestmentModal isOpen={isInvestOpen} onClose={() => setIsInvestOpen(false)} defaultPackage={selectedPkg} />
    </div>
  );
}
