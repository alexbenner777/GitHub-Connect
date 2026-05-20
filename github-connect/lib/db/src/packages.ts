export interface PackageDef {
  id: string;
  name: string;
  price: number;
  shares: number;
}

export const PACKAGES_CATALOG: PackageDef[] = [
  { id: "founder1", name: "Starter",      price: 250,    shares: 0.63  },
  { id: "founder2", name: "Partner",      price: 1000,   shares: 2.5   },
  { id: "founder3", name: "Insider",      price: 5000,   shares: 12.5  },
  { id: "founder4", name: "Visionary",    price: 25000,  shares: 62.5  },
  { id: "founder5", name: "Co-Investor",  price: 100000, shares: 250   },
];

export const PACKAGES_MAP: Record<string, PackageDef> = Object.fromEntries(
  PACKAGES_CATALOG.map((p) => [p.id, p]),
);
