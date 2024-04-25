import { CSSProperties, ReactNode } from "react";

export interface CellProps {
  before?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  after?: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  withCursor?: boolean;
  afterStyles?: CSSProperties;
  onClick?: () => void;
}

export interface RichCellProps {
  before?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  after?: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  withCursor?: boolean;
  afterStyles?: CSSProperties;
}

