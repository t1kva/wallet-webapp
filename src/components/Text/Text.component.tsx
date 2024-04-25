import { FC } from "react";

import cx from "classnames";

import type { TextProps } from "../../types/text";

export const Text: FC<TextProps> = ({
  weight = "",
  size,
  lineHeight,
  children,
  style = {},
  className = "",
  color = "",
}) => {
  return (
    <span
      className={cx({ [className]: className })}
      style={{
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
