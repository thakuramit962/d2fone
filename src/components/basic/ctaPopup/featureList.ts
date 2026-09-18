import { Href } from "expo-router";

export const featureList: FeatureItem[] = [
  {
    id: "yield_predictor",
    title: "Yield Predictor",
    tagline: "Estimate your harvest returns before you cut.",
    route: "/yieldPredictor",
    frequency: "once",
  },
  {
    id: "spray_service",
    title: "Book Spray Service",
    tagline: "Get drone, tractor, or manual spraying at your doorstep.",
    route: "/sprays",
    frequency: "always",
  },
];

interface FeatureItem {
  id: string;
  title: string;
  tagline: string;
  route: Href;
  frequency: "once" | "always";
}
