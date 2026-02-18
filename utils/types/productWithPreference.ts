import type { Product, Shop } from "~/utils/prisma";

export type ProductWithPreference =
  Omit<Product, 'startDate' | 'endDate'> & {
    shop: Omit<Shop, 'lastUpdated'>;
    preference: boolean | null;
    startDate: number;
    endDate: number;
    category: string | null
  }
