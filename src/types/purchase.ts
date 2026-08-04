export const PURCHASE_CATEGORIES = [
  "Office Supplies",
  "Equipment",
  "Transport",
  "Utilities",
  "Services",
  "Other",
] as const;

export type PurchaseCategory = (typeof PURCHASE_CATEGORIES)[number];

export const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "Mobile Money",
  "Company Card",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface Purchase {
  id: string;
  itemName: string;
  category: PurchaseCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  purchaseDate: string;
  supplier: string;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
}

export type PurchaseDraft = Omit<Purchase, "id" | "total" | "createdAt">;
