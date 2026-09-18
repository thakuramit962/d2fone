export interface BhaavItem {
  arrival_date: string;
  commodity: string;
  district: string;
  grade: string;
  market: string;
  max_price: string;
  min_price: string;
  modal_price: string;
  state: string;
  variety: string;
}

export interface BhaavFilters {
  state: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  grade?: string;
  arrival_date?: string;
  offset?: number;
}

export interface BhaavState {
  loading: boolean;
  list: BhaavItem[];
  error: string | null;
  total: number;
  updatedAt: string | null;
  mandis: string[];
  districts: string[];
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface GroupedCommodity {
  commodity: string;
  items: BhaavItem[];
}
