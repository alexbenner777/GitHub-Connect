import { useState, useEffect, useCallback } from "react";
import logoPath from "@assets/logo_trends_1777962710178.png";

const TOTAL = 8;

export default function Presentation() {
  const [slide, setSlide] = useState(0);

  const prev = useCallback(() => setSlide(s => Math.max(0, s - 1)), []);
  const next = useCallback(() => setSlide(s => Math.min(TOTAL - 1, s + 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0B0F1A", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}
    >
      {/* Slides */}
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {slide === 0 && <Slide0 />}
        {slide === 1 && <Slide1 />}
        {slide === 2 && <Slide2 />}
        {slide === 3 && <Slide3 />}
        {slide === 4 && <Slide4 />}
        {slide === 5 && <Slide5 />}
        {slide === 6 && <Slide6 />}
        {slide === 7 && <Slide7 />}
      </div>

      {/* Left click area */}
      <div
        onClick={prev}
        style={{ position: "absolute", left: 0, top: 0, width: "10%", height: "100%", cursor: slide > 0 ? "pointer" : "default", zIndex: 20 }}
      />
      {/* Right click area */}
      <div
        onClick={next}
        style={{ position: "absolute", right: 0, top: 0, width: "10%", height: "100%", cursor: slide < TOTAL - 1 ? "pointer" : "default", zIndex: 20 }}
      />

      {/* Arrow buttons */}
      {slide > 0 && (
        <button
          onClick={prev}
          style={{
            position: "absolute", left: "2vw", top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "50%", width: "3vw", height: "3vw", minWidth: 44, minHeight: 44,
            color: "#fff", fontSize: "1.4vw", cursor: "pointer", zIndex: 30,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)"
          }}
        >←</button>
      )}
      {slide < TOTAL - 1 && (
        <button
          onClick={next}
          style={{
            position: "absolute", right: "2vw", top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "50%", width: "3vw", height: "3vw", minWidth: 44, minHeight: 44,
            color: "#fff", fontSize: "1.4vw", cursor: "pointer", zIndex: 30,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)"
          }}
        >→</button>
      )}

      {/* Dot indicators */}
      <div style={{ position: "absolute", bottom: "2.5vh", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.6vw", zIndex: 30 }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            onClick={() => setSlide(i)}
            style={{
              width: i === slide ? "2.2vw" : "0.6vw", height: "0.6vw",
              minWidth: i === slide ? 22 : 8, minHeight: 6,
              borderRadius: 99,
              background: i === slide ? "#00D4FF" : "rgba(255,255,255,0.25)",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div style={{ position: "absolute", bottom: "2.5vh", right: "2.5vw", color: "rgba(255,255,255,0.35)", fontSize: "1.1vw", zIndex: 30 }}>
        {slide + 1} / {TOTAL}
      </div>

      {/* Logo top-left */}
      <div style={{ position: "absolute", top: "2.5vh", left: "2.5vw", display: "flex", alignItems: "center", gap: "0.6vw", zIndex: 30, opacity: slide === 0 ? 0 : 1, transition: "opacity 0.3s" }}>
        <img src={logoPath} alt="Trends" style={{ width: "2.2vw", minWidth: 28 }} />
        <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.2vw", letterSpacing: "-0.02em" }}>Trends</span>
      </div>
    </div>
  );
}

/* ─────────── SLIDE 0: COVER ─────────── */
function Slide0() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0B0F1A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%,-50%)", width: "60vw", height: "60vw", background: "radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "70%", left: "20%", width: "40vw", height: "40vw", background: "radial-gradient(ellipse, rgba(123,94,255,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Grid lines decoration */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "6vw 6vw", pointerEvents: "none" }} />

      <div style={{ position: "relative", textAlign: "center", padding: "0 8vw" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.2vw", marginBottom: "2.5vh" }}>
          <img src={logoPath} alt="Trends" style={{ width: "5vw", minWidth: 48 }} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "3.5vw", letterSpacing: "-0.03em" }}>Trends</span>
        </div>

        <div style={{ display: "inline-block", background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 99, padding: "0.5vh 1.8vw", color: "#00D4FF", fontSize: "1.1vw", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3vh" }}>
          Партнёрская программа
        </div>

        <div style={{ color: "#fff", fontSize: "5.5vw", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "2.5vh" }}>
          Первый Reels<br />
          <span style={{ background: "linear-gradient(90deg, #00D4FF, #7B5EFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>внутри Telegram</span>
        </div>

        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.5vw", fontWeight: 400, maxWidth: "38vw", margin: "0 auto", lineHeight: 1.5 }}>
          Зарабатывайте с нами — инвестируйте и приглашайте партнёров в многоуровневой системе вознаграждений
        </div>

        <div style={{ marginTop: "4vh", color: "rgba(255,255,255,0.3)", fontSize: "1vw", letterSpacing: "0.1em", textTransform: "uppercase" }}>МАЙ 2026</div>
      </div>
    </div>
  );
}

/* ─────────── SLIDE 1: ЧТО ТАКОЕ TRENDS ─────────── */
function Slide1() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0B0F1A", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-5vw", top: "50%", transform: "translateY(-50%)", width: "55vw", height: "55vw", background: "radial-gradient(ellipse, rgba(123,94,255,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ padding: "0 7vw", width: "100%", display: "flex", gap: "6vw", alignItems: "center" }}>
        {/* Left */}
        <div style={{ flex: "0 0 46%" }}>
          <div style={{ color: "#7B5EFF", fontSize: "1vw", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5vh" }}>О продукте</div>
          <div style={{ color: "#fff", fontSize: "3.8vw", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2.5vh" }}>
            Что такое<br /><span style={{ color: "#00D4FF" }}>Trends?</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.35vw", lineHeight: 1.65, marginBottom: "3vh" }}>
            Первая алгоритмическая Reels-лента внутри Telegram. Пользователи смотрят вертикальные видео, авторы монетизируют контент — всё без установки отдельного приложения.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
            {[
              { icon: "✓", text: "Вертикальная видеолента стабильна — MVP готов" },
              { icon: "✓", text: "Бэкенд, хранение, аналитика, антифрод — готово" },
              { icon: "✓", text: "Авторы загружают контент — механика работает" },
              { icon: "→", text: "Вход без установки — один клик через Telegram" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "0.8vw" }}>
                <span style={{ color: "#00D4FF", fontSize: "1.2vw", fontWeight: 700, marginTop: "0.1vh", flexShrink: 0 }}>{icon}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.2vw", lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — stats */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2vh" }}>
          {[
            { num: "1B+", label: "Активных пользователей Telegram", color: "#00D4FF" },
            { num: "500M+", label: "Пользователей Mini Apps", color: "#7B5EFF" },
            { num: "0", label: "Конкурентов с алгоритмической Reels-лентой в Telegram", color: "#00D4FF" },
          ].map(({ num, label, color }) => (
            <div key={num} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}22`, borderLeft: `3px solid ${color}`, borderRadius: "0 12px 12px 0", padding: "2vh 2vw" }}>
              <div style={{ color, fontSize: "3vw", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>{num}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1vw", marginTop: "0.5vh" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── SLIDE 2: РЫНОК ─────────── */
function Slide2() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0B0F1A", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", padding: "0 7vw" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "70vw", height: "70vw", background: "radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ color: "#00D4FF", fontSize: "1vw", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5vh" }}>Рыночная возможность</div>
      <div style={{ color: "#fff", fontSize: "3.5vw", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "4vh", lineHeight: 1.1 }}>
        Пустой рынок внутри <span style={{ color: "#00D4FF" }}>гиганта</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1.5vw" }}>
        {[
          { value: "$2M", label: "Pre-Seed раунд", sub: "текущая оценка", color: "#00D4FF" },
          { value: "$5–10M", label: "Оценка при входе партнёра", sub: "потенциал роста 10x+", color: "#7B5EFF" },
          { value: "7", label: "Источников выручки", sub: "реклама, donate, e-comm и др.", color: "#00D4FF" },
          { value: "Notcoin", label: "Референс роста", sub: "стартовал точно так же", color: "#7B5EFF" },
        ].map(({ value, label, sub, color }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "2.5vh 1.8vw", display: "flex", flexDirection: "column", gap: "0.8vh" }}>
            <div style={{ color, fontSize: "2.8vw", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
            <div style={{ color: "#fff", fontSize: "1.1vw", fontWeight: 600 }}>{label}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "1vw" }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "3vh", background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12, padding: "1.8vh 2vw", display: "flex", alignItems: "center", gap: "1.5vw" }}>
        <div style={{ color: "#00D4FF", fontSize: "1.6vw", flexShrink: 0 }}>!</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.15vw", lineHeight: 1.5 }}>
          Telegram — единственная крупная соцсеть <strong style={{ color: "#fff" }}>без алгоритмической видеоленты</strong>. TikTok, Reels, Shorts уже доказали модель. Trends заполняет этот пробел первым.
        </div>
      </div>
    </div>
  );
}

/* ─────────── SLIDE 3: MLM СТРУКТУРА ─────────── */
function Slide3() {
  const levels = [
    { level: "1", pct: "10%", label: "Прямые партнёры", desc: "Вы лично пригласили инвестора", color: "#00D4FF" },
    { level: "2", pct: "5%", label: "Партнёры 2-го уровня", desc: "Приглашённые вашими партнёрами", color: "#2EC4FF" },
    { level: "3", pct: "3%", label: "Партнёры 3-го уровня", desc: "3-й уровень глубины", color: "#7B5EFF" },
    { level: "4", pct: "1%", label: "Партнёры 4-го уровня", desc: "4-й уровень глубины", color: "#9B7EFF" },
    { level: "5", pct: "1%", label: "Партнёры 5-го уровня", desc: "5-й уровень глубины", color: "#B8A0FF" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#0B0F1A", display: "flex", alignItems: "center", overflow: "hidden", padding: "0 7vw" }}>
      <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "45vw", height: "45vw", background: "radial-gradient(ellipse, rgba(123,94,255,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ flex: "0 0 40%", paddingRight: "4vw" }}>
        <div style={{ color: "#7B5EFF", fontSize: "1vw", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5vh" }}>Партнёрская программа</div>
        <div style={{ color: "#fff", fontSize: "3.5vw", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2vh" }}>
          Как работает<br /><span style={{ color: "#7B5EFF" }}>MLM-система</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.2vw", lineHeight: 1.6, marginBottom: "2.5vh" }}>
          5 уровней глубины. Вы получаете бонус с каждой инвестиции в вашей структуре — автоматически, без ограничений.
        </div>
        <div style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12, padding: "1.5vh 1.5vw" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1vw", marginBottom: "0.5vh" }}>Итого с объёма сети</div>
          <div style={{ color: "#00D4FF", fontSize: "2.2vw", fontWeight: 800 }}>до 20%</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95vw" }}>10+5+3+1+1 = 20% от инвестиций структуры</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1vh" }}>
        {levels.map(({ level, pct, label, desc, color }) => (
          <div key={level} style={{ display: "flex", alignItems: "center", gap: "1.2vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.4vh 1.5vw", marginLeft: `${(parseInt(level) - 1) * 1.5}vw` }}>
            <div style={{ width: "2.8vw", height: "2.8vw", minWidth: 36, minHeight: 36, borderRadius: "50%", background: `${color}22`, border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 800, fontSize: "1.1vw", flexShrink: 0 }}>
              {level}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.15vw" }}>{label}</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95vw" }}>{desc}</div>
            </div>
            <div style={{ color, fontSize: "2vw", fontWeight: 800, flexShrink: 0 }}>{pct}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── SLIDE 4: ПАКЕТЫ ─────────── */
function Slide4() {
  const pkgs = [
    { name: "Starter", price: "$250", share: "0.005%", rev: "RevShare", highlight: false, color: "#4A9EFF" },
    { name: "Genesis", price: "$1 000", share: "0.02%", rev: "RevShare + Priority", highlight: false, color: "#00D4FF" },
    { name: "Growth", price: "$10 000", share: "0.2%", rev: "RevShare + Board Access", highlight: true, color: "#7B5EFF" },
    { name: "Whale", price: "$50 000", share: "1%", rev: "RevShare + Full Access", highlight: false, color: "#FF6B9D" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#0B0F1A", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", padding: "0 6vw" }}>
      <div style={{ position: "absolute", left: "50%", top: "30%", transform: "translateX(-50%)", width: "60vw", height: "40vw", background: "radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ color: "#00D4FF", fontSize: "1vw", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1vh", textAlign: "center" }}>Инвестиционные пакеты</div>
      <div style={{ color: "#fff", fontSize: "3vw", fontWeight: 800, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "3.5vh" }}>
        Выберите свой <span style={{ color: "#00D4FF" }}>уровень входа</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1.5vw" }}>
        {pkgs.map(({ name, price, share, rev, highlight, color }) => (
          <div key={name} style={{
            background: highlight ? `linear-gradient(145deg, ${color}18, ${color}08)` : "rgba(255,255,255,0.04)",
            border: highlight ? `1.5px solid ${color}55` : "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: "3vh 1.8vw",
            display: "flex", flexDirection: "column", gap: "1.5vh",
            position: "relative"
          }}>
            {highlight && (
              <div style={{ position: "absolute", top: "-1.5vh", left: "50%", transform: "translateX(-50%)", background: color, color: "#fff", fontSize: "0.85vw", fontWeight: 700, padding: "0.3vh 1.2vw", borderRadius: 99, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                ПОПУЛЯРНЫЙ
              </div>
            )}
            <div style={{ color, fontSize: "1.1vw", fontWeight: 700, letterSpacing: "0.05em" }}>{name}</div>
            <div style={{ color: "#fff", fontSize: "2.8vw", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>{price}</div>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8vh" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "1vw" }}>Доля</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1vw" }}>{share}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "1vw" }}>Модель</span>
                <span style={{ color, fontWeight: 600, fontSize: "0.95vw", textAlign: "right" }}>{rev}</span>
              </div>
            </div>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9vw", lineHeight: 1.4 }}>
              + MLM-бонусы с партнёрской сети 5 уровней
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "2.5vh", color: "rgba(255,255,255,0.4)", fontSize: "1vw" }}>
        Все пакеты дают реф-ссылку для построения партнёрской сети
      </div>
    </div>
  );
}

/* ─────────── SLIDE 5: КАЛЬКУЛЯТОР ЗАРАБОТКА ─────────── */
function Slide5() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0B0F1A", display: "flex", alignItems: "center", overflow: "hidden", padding: "0 7vw" }}>
      <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "50vw", height: "50vw", background: "radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ flex: "0 0 42%", paddingRight: "4vw" }}>
        <div style={{ color: "#00D4FF", fontSize: "1vw", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5vh" }}>Ваш заработок</div>
        <div style={{ color: "#fff", fontSize: "3.4vw", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2vh" }}>
          Пример на<br /><span style={{ color: "#00D4FF" }}>Genesis $1 000</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.2vw", lineHeight: 1.6, marginBottom: "2vh" }}>
          Вы вложили $1 000 и пригласили 3 партнёров. Каждый из них тоже пригласил по 3. Считаем доход с двух уровней.
        </div>
        <div style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(123,94,255,0.1))", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 14, padding: "2vh 1.8vw" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1vw", marginBottom: "0.5vh" }}>Итого за 2 уровня</div>
          <div style={{ color: "#00D4FF", fontSize: "3.5vw", fontWeight: 800, letterSpacing: "-0.03em" }}>$435</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95vw" }}>с 12 партнёров, только 2 уровня</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5vh" }}>
        {/* Level 1 */}
        <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 14, padding: "1.8vh 1.8vw" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1vh" }}>
            <div>
              <div style={{ color: "#00D4FF", fontWeight: 700, fontSize: "1.1vw" }}>Уровень 1 — 10%</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "1vw" }}>3 партнёра × $1 000</div>
            </div>
            <div style={{ color: "#00D4FF", fontSize: "2.2vw", fontWeight: 800 }}>$300</div>
          </div>
          <div style={{ display: "flex", gap: "0.8vw" }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ flex: 1, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, padding: "0.8vh 0", textAlign: "center", color: "#00D4FF", fontWeight: 700, fontSize: "1vw" }}>
                Партнёр {n}<br /><span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400, fontSize: "0.85vw" }}>$1000 → $100</span>
              </div>
            ))}
          </div>
        </div>

        {/* Level 2 */}
        <div style={{ background: "rgba(123,94,255,0.06)", border: "1px solid rgba(123,94,255,0.2)", borderRadius: 14, padding: "1.8vh 1.8vw" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1vh" }}>
            <div>
              <div style={{ color: "#7B5EFF", fontWeight: 700, fontSize: "1.1vw" }}>Уровень 2 — 5%</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "1vw" }}>9 партнёров × $1 000</div>
            </div>
            <div style={{ color: "#7B5EFF", fontSize: "2.2vw", fontWeight: 800 }}>$450</div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95vw" }}>
            Каждый из 3 партнёров приглашает ещё 3 — 9 инвесторов по $1000 → 5% с каждого
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.2vh 1.5vw", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05vw" }}>Уровни 3–5 (3+1+1%) от растущей сети</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: "1.2vw" }}>+ доп. бонусы</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────── SLIDE 6: КАК НАЧАТЬ ─────────── */
function Slide6() {
  const steps = [
    {
      num: "01",
      title: "Зарегистрируйтесь",
      desc: "Создайте аккаунт на trendspartner.space — займёт 2 минуты. Никаких лишних шагов.",
      color: "#00D4FF",
    },
    {
      num: "02",
      title: "Выберите пакет",
      desc: "Выберите пакет от $250. Получите личный кабинет инвестора и реф-ссылку.",
      color: "#7B5EFF",
    },
    {
      num: "03",
      title: "Приглашайте и зарабатывайте",
      desc: "Делитесь реф-ссылкой. Бонусы начисляются автоматически при каждой инвестиции в вашей сети.",
      color: "#00D4FF",
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#0B0F1A", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", padding: "0 7vw" }}>
      <div style={{ position: "absolute", right: "5vw", top: "50%", transform: "translateY(-50%)", width: "50vw", height: "50vw", background: "radial-gradient(ellipse, rgba(123,94,255,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ color: "#7B5EFF", fontSize: "1vw", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5vh" }}>Старт</div>
      <div style={{ color: "#fff", fontSize: "3.5vw", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "4vh", lineHeight: 1.1 }}>
        Как <span style={{ color: "#7B5EFF" }}>начать</span> за 3 шага
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2vw", position: "relative" }}>
        {/* Connector line */}
        <div style={{ position: "absolute", top: "3.5vh", left: "16%", right: "16%", height: "2px", background: "linear-gradient(90deg, #00D4FF33, #7B5EFF33, #00D4FF33)", zIndex: 0 }} />

        {steps.map(({ num, title, desc, color }, i) => (
          <div key={num} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}22`, borderRadius: 18, padding: "3vh 2vw", position: "relative", zIndex: 1 }}>
            <div style={{
              width: "3.5vw", height: "3.5vw", minWidth: 44, minHeight: 44,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${color}33, ${color}11)`,
              border: `2px solid ${color}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color, fontWeight: 800, fontSize: "1.3vw",
              marginBottom: "2vh"
            }}>{num}</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.4vw", marginBottom: "1vh" }}>{title}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.1vw", lineHeight: 1.55 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "3vh", background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12, padding: "1.5vh 2vw", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.1vw" }}>
          Вступай сейчас — пока структура только формируется, позиции в сети максимально выгодные
        </span>
        <span style={{ color: "#00D4FF", fontWeight: 700, fontSize: "1.2vw", flexShrink: 0, marginLeft: "2vw" }}>Ранний партнёр = лучшая позиция</span>
      </div>
    </div>
  );
}

/* ─────────── SLIDE 7: CTA / КОНТАКТЫ ─────────── */
function Slide7() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0B0F1A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "80vw", background: "radial-gradient(ellipse, rgba(0,212,255,0.1) 0%, rgba(123,94,255,0.06) 40%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "6vw 6vw", pointerEvents: "none" }} />

      <div style={{ position: "relative", textAlign: "center", padding: "0 8vw" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1vw", marginBottom: "2vh" }}>
          <img src={logoPath} alt="Trends" style={{ width: "4vw", minWidth: 44 }} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "2.8vw", letterSpacing: "-0.03em" }}>Trends</span>
        </div>

        <div style={{ color: "#fff", fontSize: "4.5vw", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "1.5vh" }}>
          Начните зарабатывать<br />
          <span style={{ background: "linear-gradient(90deg, #00D4FF, #7B5EFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>вместе с нами</span>
        </div>

        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.4vw", marginBottom: "4vh" }}>
          Регистрация открыта. Первые 100 партнёров получают статус Genesis-основателя.
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3vw", marginBottom: "4vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95vw", marginBottom: "0.4vh", textTransform: "uppercase", letterSpacing: "0.08em" }}>Сайт</div>
            <div style={{ color: "#00D4FF", fontWeight: 700, fontSize: "1.4vw" }}>trendspartner.space</div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "rgba(255,255,255,0.12)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95vw", marginBottom: "0.4vh", textTransform: "uppercase", letterSpacing: "0.08em" }}>Telegram</div>
            <div style={{ color: "#7B5EFF", fontWeight: 700, fontSize: "1.4vw" }}>@trends_partner</div>
          </div>
          <div style={{ width: "1px", height: "4vh", background: "rgba(255,255,255,0.12)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95vw", marginBottom: "0.4vh", textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "1.3vw" }}>hello@trendspartner.space</div>
          </div>
        </div>

        <div style={{ display: "inline-flex", gap: "1.5vw" }}>
          <div style={{ background: "linear-gradient(135deg, #00D4FF, #7B5EFF)", borderRadius: 12, padding: "1.4vh 3vw", color: "#0B0F1A", fontWeight: 800, fontSize: "1.3vw" }}>
            Стать партнёром
          </div>
          <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "1.4vh 3vw", color: "#fff", fontWeight: 600, fontSize: "1.3vw" }}>
            Узнать больше
          </div>
        </div>
      </div>
    </div>
  );
}
