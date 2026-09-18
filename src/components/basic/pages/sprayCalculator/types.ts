import { SprayProduct } from "./sampleSpray";

export type SprayType = "Insecticide" | "Fungicide" | "Herbicide";

export const sprayStypes = ["Insecticide", "Fungicide", "Herbicide"];

export interface SprayCalculation {
  spray_type: string;
  technical_name: string;
  field_size: string;
  tank_capacity: string;
  total_water_required: string;
  total_chemical_required: string;
  number_of_tanks: string;
  chemical_per_tank: string;
  status: "success" | "error";
  msg: string;
  similar_products?: SprayProduct[];
}
