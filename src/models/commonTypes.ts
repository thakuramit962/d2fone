import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";
import { SvgProps } from "react-native-svg";

export interface QuickLinkItem {
  icon: React.FC<SvgProps>;
  title: string;
  description: string;
  route?: Href;
}

export interface IconLabelItem {
  icon: React.FC<SvgProps>;
  label: string;
  route?: Href;
}

export interface ListRowItem {
  icon: React.FC<SvgProps>;
  title: string;
  description: string;
  route?: Href;
}

export type FeaturedTool = {
  id: string;
  label?: string;
  title: string;
  description?: string;
  link?: Href;
  img?: ImageSourcePropType;
  img1?: ImageSourcePropType;
  icon?: React.FC<SvgProps>;
};
