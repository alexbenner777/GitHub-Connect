export const REVSHARE_CONFIG = {
  TOTAL_SHARES: 5000,
  SHARE_PRICE_R1: 330.77,
  SHARE_PRICE_R2: 430,
  ROUND1_BONUS: 1.3,          // 430/330.77 ≈ 1.300
  REVENUE_SHARE: 0.20,
  SHOWS_PER_DAY: 2,
  DAYS_IN_MONTH: 30,
  USD_RUB: 91,
  REVENUE_SOURCES_TOTAL: 7,
  REVENUE_SOURCES_IN_CALC: 1,
} as const;

export function calcPoolUsd(dau: number, cpmRub: number): number {
  const {
    SHOWS_PER_DAY, DAYS_IN_MONTH, USD_RUB, REVENUE_SHARE, TOTAL_SHARES,
  } = REVSHARE_CONFIG;
  const revenueMonthRub = dau * SHOWS_PER_DAY * cpmRub * DAYS_IN_MONTH / 1000;
  const poolUsd = (revenueMonthRub / USD_RUB) * REVENUE_SHARE;
  void TOTAL_SHARES;
  return poolUsd;
}

export function calcPayoutR2(packagePriceUsd: number, dau: number, cpmRub: number): number {
  const { SHARE_PRICE_R2, TOTAL_SHARES } = REVSHARE_CONFIG;
  const shares = packagePriceUsd / SHARE_PRICE_R2;
  return (shares / TOTAL_SHARES) * calcPoolUsd(dau, cpmRub);
}

export function calcPayoutR1(packagePriceUsd: number, dau: number, cpmRub: number): number {
  const { SHARE_PRICE_R2, ROUND1_BONUS, TOTAL_SHARES } = REVSHARE_CONFIG;
  const shares = (packagePriceUsd / SHARE_PRICE_R2) * ROUND1_BONUS;
  return (shares / TOTAL_SHARES) * calcPoolUsd(dau, cpmRub);
}

export function calcSharesR2(packagePriceUsd: number): number {
  return packagePriceUsd / REVSHARE_CONFIG.SHARE_PRICE_R2;
}

export function calcSharesR1(packagePriceUsd: number): number {
  return calcSharesR2(packagePriceUsd) * REVSHARE_CONFIG.ROUND1_BONUS;
}

// Эталонные значения (DAU=10M, CPM=120 ₽, курс 91 ₽/$):
// per-share = $31.65 / мес
// Co-Investor R2 (232.56 долей): ~$7 360   R1 (302.4 долей): ~$9 568
if (typeof window !== "undefined") {
  console.assert(Math.round(calcPoolUsd(10_000_000, 120)) === 158242, "pool 10M failed");
  console.assert(Math.round(calcPoolUsd(50_000_000, 120)) === 791209, "pool 50M failed");
  console.assert(Math.round(calcPayoutR2(100000, 10_000_000, 120)) === 7360, "R2 10M failed");
  console.assert(Math.round(calcPayoutR2(100000, 50_000_000, 120)) === 36800, "R2 50M failed");
  console.assert(Math.round(calcPayoutR1(100000, 10_000_000, 120)) === 9568, "R1 10M failed");
  console.assert(Math.round(calcPayoutR1(100000, 50_000_000, 120)) === 47841, "R1 50M failed");
}
