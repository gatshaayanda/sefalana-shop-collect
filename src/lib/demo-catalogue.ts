export type DemoDepartment = { id: string; name: string; description: string };
export type DemoProduct = {
  id: string;
  departmentId: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  emoji: string;
  available: boolean;
};

export const CATALOGUE_STORAGE_KEY = "sefalana-shop-collect:demo-catalogue:v2";
export const BASKET_STORAGE_KEY = "sefalana-shop-collect:demo-basket:v2";

export const seedDepartments: DemoDepartment[] = [
  { id: "beer-cider", name: "Beer & cider", description: "Illustrative beer and cider listings" },
  { id: "wine", name: "Wine", description: "Illustrative red, white and sparkling wine listings" },
  { id: "spirits", name: "Spirits", description: "Illustrative whisky, vodka, gin and other spirit listings" },
  { id: "ready-to-drink", name: "Ready to drink", description: "Illustrative premixed drinks and coolers" },
  { id: "mixers", name: "Mixers & alcohol-free", description: "Mixers and non-alcoholic alternatives" },
];

export const seedProducts: DemoProduct[] = [
  { id: "demo-lager", departmentId: "beer-cider", name: "Lager beer (illustrative)", description: "Synthetic test listing. Not a live brand, price or stock record.", unit: "6-pack", price: 79.9, emoji: "🍺", available: true },
  { id: "demo-beer-case", departmentId: "beer-cider", name: "Lager beer (illustrative case)", description: "Synthetic test listing for testing larger pack sizes.", unit: "case", price: 289.9, emoji: "🍻", available: true },
  { id: "demo-cider", departmentId: "beer-cider", name: "Apple cider (illustrative)", description: "Synthetic test listing. Not a live brand, price or stock record.", unit: "6-pack", price: 89.9, emoji: "🍏", available: true },
  { id: "demo-red-wine", departmentId: "wine", name: "Red wine (illustrative)", description: "Synthetic test listing for the wine category.", unit: "750 ml bottle", price: 99.9, emoji: "🍷", available: true },
  { id: "demo-white-wine", departmentId: "wine", name: "White wine (illustrative)", description: "Synthetic test listing for the wine category.", unit: "750 ml bottle", price: 94.9, emoji: "🥂", available: true },
  { id: "demo-sparkling-wine", departmentId: "wine", name: "Sparkling wine (illustrative)", description: "Synthetic test listing for celebrations and gifting.", unit: "750 ml bottle", price: 149.9, emoji: "🥂", available: true },
  { id: "demo-whisky", departmentId: "spirits", name: "Blended whisky (illustrative)", description: "Synthetic test listing. Not a live brand, price or stock record.", unit: "750 ml bottle", price: 229.9, emoji: "🥃", available: true },
  { id: "demo-vodka", departmentId: "spirits", name: "Vodka (illustrative)", description: "Synthetic test listing for the spirits category.", unit: "750 ml bottle", price: 189.9, emoji: "🍸", available: true },
  { id: "demo-gin", departmentId: "spirits", name: "Gin (illustrative)", description: "Synthetic test listing for the spirits category.", unit: "750 ml bottle", price: 219.9, emoji: "🍸", available: true },
  { id: "demo-cooler", departmentId: "ready-to-drink", name: "Premixed spirit cooler (illustrative)", description: "Synthetic test listing for ready-to-drink products.", unit: "6-pack", price: 99.9, emoji: "🍹", available: true },
  { id: "demo-tonic", departmentId: "mixers", name: "Tonic water", description: "Synthetic non-alcoholic mixer listing.", unit: "1 L bottle", price: 19.9, emoji: "🫧", available: true },
  { id: "demo-sparkling-water", departmentId: "mixers", name: "Sparkling water", description: "Synthetic non-alcoholic mixer listing.", unit: "1 L bottle", price: 14.9, emoji: "💧", available: true },
];

export function readDemoCatalogue(): { departments: DemoDepartment[]; products: DemoProduct[] } {
  if (typeof window === "undefined") return { departments: seedDepartments, products: seedProducts };
  try {
    const raw = window.localStorage.getItem(CATALOGUE_STORAGE_KEY);
    if (!raw) return { departments: seedDepartments, products: seedProducts };
    const parsed = JSON.parse(raw) as { departments?: DemoDepartment[]; products?: DemoProduct[] };
    if (!Array.isArray(parsed.departments) || !Array.isArray(parsed.products)) throw new Error("Invalid demo catalogue");
    return { departments: parsed.departments, products: parsed.products };
  } catch {
    return { departments: seedDepartments, products: seedProducts };
  }
}

export function saveDemoCatalogue(value: { departments: DemoDepartment[]; products: DemoProduct[] }) {
  window.localStorage.setItem(CATALOGUE_STORAGE_KEY, JSON.stringify(value));
}

export function formatBwp(value: number) {
  return `P ${new Intl.NumberFormat("en-BW", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
}
