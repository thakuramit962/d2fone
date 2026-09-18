export interface SprayProduct {
  id: number;
  spray_type: string;
  technical_name: string;
  base_dose: number;
  unit: string;
  minimum_water_per_acre: number;
  minimum_chemical_per_acre: number;

  chemical: string;
  chemical_name: string;
  company_name: string;
}
