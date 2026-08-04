import type { Purchase } from "../types/purchase";

const PURCHASES_KEY = "company-purchase-tracker:purchases";

const today = new Date().toISOString().slice(0, 10);

const samplePurchase: Purchase = {
  id: "sample-paper-purchase",
  itemName: "Paper",
  category: "Office Supplies",
  quantity: 20,
  unit: "pieces",
  unitPrice: 1000,
  total: 20000,
  purchaseDate: today,
  supplier: "Office Shop Ltd",
  paymentMethod: "Cash",
  notes: "Example purchase",
  createdAt: new Date().toISOString(),
};

function isPurchase(value: unknown): value is Purchase {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Purchase>;

  return (
    typeof item.id === "string" &&
    typeof item.itemName === "string" &&
    typeof item.category === "string" &&
    typeof item.quantity === "number" &&
    typeof item.unit === "string" &&
    typeof item.unitPrice === "number" &&
    typeof item.total === "number" &&
    typeof item.purchaseDate === "string" &&
    typeof item.supplier === "string" &&
    typeof item.paymentMethod === "string" &&
    typeof item.notes === "string" &&
    typeof item.createdAt === "string"
  );
}

export function loadPurchases(): Purchase[] {
  try {
    const saved = window.localStorage.getItem(PURCHASES_KEY);

    if (!saved) {
      window.localStorage.setItem(
        PURCHASES_KEY,
        JSON.stringify([samplePurchase]),
      );
      return [samplePurchase];
    }

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [samplePurchase];

    return parsed.filter(isPurchase);
  } catch (error) {
    console.error("Could not load purchases from browser storage.", error);
    return [samplePurchase];
  }
}

export function savePurchases(purchases: Purchase[]): boolean {
  try {
    window.localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
    return true;
  } catch (error) {
    console.error("Could not save purchases to browser storage.", error);
    return false;
  }
}
