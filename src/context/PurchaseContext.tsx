import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadPurchases, savePurchases } from "../lib/storage";
import type { Purchase, PurchaseDraft } from "../types/purchase";

interface PurchaseContextValue {
  purchases: Purchase[];
  addPurchase: (draft: PurchaseDraft) => Purchase;
  updatePurchase: (id: string, draft: PurchaseDraft) => Purchase;
  deletePurchase: (id: string) => void;
  storageError: string;
}

const PurchaseContext = createContext<PurchaseContextValue | undefined>(undefined);

function createPurchaseId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `purchase-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeDraft(draft: PurchaseDraft): PurchaseDraft {
  const quantity = Number(draft.quantity);
  const unitPrice = Number(draft.unitPrice);
  const itemName = draft.itemName.trim();
  const unit = draft.unit.trim();

  if (!itemName) {
    throw new Error("Item name is required.");
  }
  if (!unit) {
    throw new Error("Unit is required.");
  }
  if (!draft.purchaseDate) {
    throw new Error("Purchase date is required.");
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    throw new Error("Unit price cannot be negative.");
  }

  return {
    ...draft,
    itemName,
    unit,
    supplier: draft.supplier.trim(),
    notes: draft.notes.trim(),
    quantity,
    unitPrice,
  };
}

export function PurchaseProvider({ children }: PropsWithChildren) {
  const [purchases, setPurchases] = useState<Purchase[]>(() => loadPurchases());
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    const saved = savePurchases(purchases);
    setStorageError(
      saved
        ? ""
        : "The purchase is visible now, but the browser could not save it permanently.",
    );
  }, [purchases]);

  const addPurchase = useCallback((draft: PurchaseDraft): Purchase => {
    const normalized = normalizeDraft(draft);
    const purchase: Purchase = {
      ...normalized,
      id: createPurchaseId(),
      total: normalized.quantity * normalized.unitPrice,
      createdAt: new Date().toISOString(),
    };

    setPurchases((current) => [purchase, ...current]);
    return purchase;
  }, []);

  const updatePurchase = useCallback(
    (id: string, draft: PurchaseDraft): Purchase => {
      const existing = purchases.find((purchase) => purchase.id === id);
      if (!existing) {
        throw new Error("The purchase record could not be found.");
      }

      const normalized = normalizeDraft(draft);
      const updatedPurchase: Purchase = {
        ...existing,
        ...normalized,
        total: normalized.quantity * normalized.unitPrice,
      };

      setPurchases((current) =>
        current.map((purchase) =>
          purchase.id === id ? updatedPurchase : purchase,
        ),
      );

      return updatedPurchase;
    },
    [purchases],
  );

  const deletePurchase = useCallback((id: string) => {
    setPurchases((current) =>
      current.filter((purchase) => purchase.id !== id),
    );
  }, []);

  const value = useMemo<PurchaseContextValue>(
    () => ({
      purchases,
      addPurchase,
      updatePurchase,
      deletePurchase,
      storageError,
    }),
    [purchases, addPurchase, updatePurchase, deletePurchase, storageError],
  );

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchases() {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchases must be used inside PurchaseProvider");
  }
  return context;
}
