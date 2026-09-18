export interface WeatherReport {
  fetching: boolean;
  data: WeatherData | null;
  errorMessage: string | null;
}
export interface WeatherData {
  current: CurrentData;
  forecast: Forcast;
  location: WeatherLoaction;
  alerts: {
    alert: WeatherAlert[];
  };
  lastUpdated: string | null;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}
export interface CurrentData {
  temp_c: number;
  condition: WeatherCondition;
  humidity: number;
  wind_kph: number;
  air_quality: {
    pm2_5: number;
  };
  uv: number;
  pressure_mb: number;
  last_updated: string;
}

export interface ForcastDetail {
  mintemp_c: number;
  maxtemp_c: number;
  avgtemp_c: number;
  condition: WeatherCondition;
  air_quality: {
    pm2_5: number;
  };
  avghumidity: number;
  avgvis_km: number;
  daily_chance_of_rain: number;
  totalprecip_mm: number;
  uv: number;
}

export interface forcastDay {
  date: string;
  day: ForcastDetail;
  astro?: {
    sunrise?: string;
    sunset?: string;
  };
}

export interface Forcast {
  forecastday: forcastDay[];
}
export interface WeatherLoaction {
  name: string;
  region: string;
}

export interface WeatherAlert {
  identifier: string; // "581b6745-6aab-11f1-a97a-b63eaaff3386"
  headline: string; // "River Buridehing at Khowang in Dibrugarh district of Assam continues to flow in above normal flood situation at 10:00 pm today."
  msgtype: string; // "Alert"
  severity: string; // "Moderate"
  urgency: string; // "Future"
  areas: string; // "Buridehing, Khowang, Dibrugarh, Assam"
  category: string; // "Met"
  certainty: string; // "Observed"
  event: string; // "Flood"
  note: string; // ""
  effective: string; // "2026-06-17T22:00:00+05:30"
  expires: string; // "2026-06-18T18:00:00+05:30"
  desc: string; // "River Buridehing at Khowang in Dibrugarh district of Assam continues to flow in above normal flood situation at 10:00 pm today..."
  instruction: string; // ""
}
