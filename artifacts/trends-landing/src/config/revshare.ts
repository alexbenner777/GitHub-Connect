export const REVSHARE_CONFIG = {
  TOTAL_SHARES: 5000,
  SHARE_PRICE_R1: 331,
  SHARE_PRICE_R2: 430,
  ROUND1_BONUS: 430 / 331,   // = 1.2991… (R2/R1)
  REVENUE_SHARE: 0.20,
  SHOWS_PER_DAY: 2,
  DAYS_IN_MONTH: 30,
  USD_RUB: 91,
  REVENUE_SOURCES_TOTAL: 7,
  REVENUE_SOURCES_IN_CALC: 1,
  TOKEN_PRICE_R1: 0.001655,  // 331 / 200 000
  TOKEN_PRICE_R2: 0.002150,  // 430 / 200 000
  TOKENS_PER_SHARE: 200_000,
} as const;

export function calcPoolUsd(dau: number, cpmRub: number): number {
  const { SHOWS_PER_DAY, DAYS_IN_MONTH, USD_RUB, REVENUE_SHARE } = REVSHARE_CONFIG;
  const revenueMonthRub = dau * SHOWS_PER_DAY * cpmRub * DAYS_IN_MONTH / 1000;
  return (revenueMonthRub / USD_RUB) * REVENUE_SHARE;
}

export function calcPayoutR2(packagePriceUsd: number, dau: number, cpmRub: number): number {
  const { SHARE_PRICE_R2, TOTAL_SHARES } = REVSHARE_CONFIG;
  return (packagePriceUsd / SHARE_PRICE_R2 / TOTAL_SHARES) * calcPoolUsd(dau, cpmRub);
}

export function calcPayoutR1(packagePriceUsd: number, dau: number, cpmRub: number): number {
  const { SHARE_PRICE_R1, TOTAL_SHARES } = REVSHARE_CONFIG;
  return (packagePriceUsd / SHARE_PRICE_R1 / TOTAL_SHARES) * calcPoolUsd(dau, cpmRub);
}

export function calcSharesR2(packagePriceUsd: number): number {
  return packagePriceUsd / REVSHARE_CONFIG.SHARE_PRICE_R2;
}

export function calcSharesR1(packagePriceUsd: number): number {
  return packagePriceUsd / REVSHARE_CONFIG.SHARE_PRICE_R1;
}

// Эталон: DAU=10M, CPM=120₽, курс 91₽/$
// per-share = $31,65/мес
// Co-Investor R1 (302,11 долей): $9 561   R2 (232,56 долей): $7 360
if (typeof window !== "undefined") {
  console.assert(Math.round(calcPoolUsd(10_000_000, 120)) === 158242, "pool 10M failed");
  console.assert(Math.round(calcPoolUsd(50_000_000, 120)) === 791209, "pool 50M failed");
  console.assert(Math.round(calcPayoutR2(100000, 10_000_000, 120)) === 7360, "R2 10M failed");
  console.assert(Math.round(calcPayoutR2(100000, 50_000_000, 120)) === 36800, "R2 50M failed");
  console.assert(Math.round(calcPayoutR1(100000, 10_000_000, 120)) === 9561, "R1 10M failed");
  console.assert(Math.round(calcPayoutR1(100000, 50_000_000, 120)) === 47807, "R1 50M failed");
}
