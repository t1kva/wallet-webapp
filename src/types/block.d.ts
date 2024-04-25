import { CSSProperties, ReactNode } from "react";

export interface BlockProps {
  className?: string;
  style?: CSSProperties;
  padding?: number | string;
  children?: ReactNode;
  noBackground?: boolean;
  onClick?: () => void;
}

export interface ErrorBlockProps {
  text?: string;
  color?: string;
  backgroundColor?: string;
  iconColor?: string;
}
