export interface ParamOptions {
  crops: string[];
  soil_types: string[];
}

export interface YieldPredictorType {
  crop: { id: number; label: string; value: string }[];
  state: { id: number; label: string; value: string }[];
  district: { id: number; label: string; value: string }[];
  soil_type: { id: number; label: string; value: string }[];
  sowing_date: string;
  field_size: string;
}

export interface Result {
  total_expected_yield: {
    max: number;
    min: number;
    unit: string;
  };
  yield_expectation: {
    label: string;
  };
  msg: string;
  status: "success" | "error";
}
