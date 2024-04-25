import { FC } from "react";
import cx from "classnames";

import type { ButtonProps } from "../../types/button";

import styles from "./Button.module.css";
import { Text } from "../Text";

export const Button: FC<ButtonProps> = ({
  before,
  children,
  stretched,
  disabled,
  color,
  style,
  hasHover = true,
  size = "s",
  mode = "primary",
  className = "",
  onClick = () => {},
}) => {
  return (
    <button
      style={style}
      className={cx(styles.__wrapper, {
        [styles.__disabled]: disabled,
        [styles.__stretched]: stretched,
        [styles.__with_hover]: hasHover,
        [styles[`__size_${size}`]]: size,
        [styles[`__mode_${mode}`]]: mode,
        [className]: className,
      })}
      disabled={disabled}
      onClick={onClick}
    >
      <div className={styles.__wrapper_in}>
        {before ? <div className={styles.__before}>{before}</div> : null}
        {children ? (
          <div className={styles.__content}>
            <Text color={color} className={styles.__content_in}>
              {children}
            </Text>
          </div>
        ) : null}
      </div>
      <div className={styles.__overlay} />
    </button>
  );
};
