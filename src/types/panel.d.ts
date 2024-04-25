import { ReactNode } from "react";

export interface PanelHeaderProps {
  children: ReactNode;
  after?: ReactNode;
  before?: ReactNode;
  className?: string;
}

export interface PanelProps {
  children: ReactNode;
  header?: any;
  className?: string;
  centerVertical?: boolean;
  centerHorizontal?: boolean;
}

