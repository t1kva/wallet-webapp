import React from "react";
import cx from "classnames";

import styles from "./Separator.module.css";

type SeparatorProps = {
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ className = "" }) => {
  return (
    <div
      className={cx(styles._wrapper, {
        [className]: className,
      })}
    />
  );
};
