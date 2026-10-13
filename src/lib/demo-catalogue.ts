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

export const CATALOGUE_STORAGE_KEY = "sefalana-shop-collect:demo-catalogue:v1";
export const BASKET_STORAGE_KEY = "sefalana-shop-collect:demo-basket:v1";

export const seedDepartments: DemoDepartment[] = [
  { id: "fresh", name: "Fresh produce", description: "Fruit and vegetables" },
  { id: "pantry", name: "Pantry", description: "Everyday cupboard essentials" },
  { id: "dairy", name: "Dairy & eggs", description: "Chilled essentials" },
  { id: "bakery", name: "Bakery", description: "Bread and baked goods" },
  { id: "home", name: "Home care", description: "Household basics" },
];

export const seedProducts: DemoProduct[] = [
  { id: "demo-apple", departmentId: "fresh", name: "Apples", description: "Sample fresh fruit listing", unit: "per kg", price: 24.9, emoji: "🍎", available: true },
  { id: "demo-bananas", departmentId: "fresh", name: "Bananas", description: "Sample fresh fruit listing", unit: "per bunch", price: 18.5, emoji: "🍌", available: true },
  { id: "demo-tomatoes", departmentId: "fresh", name: "Tomatoes", description: "Sample fresh produce listing", unit: "per kg", price: 22, emoji: "🍅", available: true },
  { id: "demo-rice", departmentId: "pantry", name: "Long-grain rice", description: "Sample pantry listing", unit: "2 kg bag", price: 34.9, emoji: "🍚", available: true },
  { id: "demo-oil", departmentId: "pantry", name: "Cooking oil", description: "Sample pantry listing", unit: "2 L bottle", price: 49.9, emoji: "🫗", available: true },
  { id: "demo-beans", departmentId: "pantry", name: "Baked beans", description: "Sample pantry listing", unit: "410 g tin", price: 12.5, emoji: "🥫", available: true },
  { id: "demo-milk", departmentId: "dairy", name: "Full cream milk", description: "Sample chilled listing", unit: "1 L carton", price: 16.9, emoji: "🥛", available: true },
  { id: "demo-eggs", departmentId: "dairy", name: "Eggs", description: "Sample chilled listing", unit: "dozen", price: 32, emoji: "🥚", available: true },
  { id: "demo-bread", departmentId: "bakery", name: "Brown bread", description: "Sample bakery listing", unit: "loaf", price: 14.5, emoji: "🍞", available: true },
  { id: "demo-soap", departmentId: "home", name: "Laundry powder", description: "Sample home-care listing", unit: "1 kg pack", price: 29.9, emoji: "🧺", available: true },
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
  return new Intl.NumberFormat("en-BW", { style: "currency", currency: "BWP", minimumFractionDigits: 2 }).format(value);
}
