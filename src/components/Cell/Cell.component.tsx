import { FC } from "react";
import cx from "classnames";

import type { CellProps } from "../../types/cell";

import { Text } from "../Text";

import styles from "./Cell.module.css";

export const Cell: FC<CellProps> = ({
  before,
  after,
  children,
  description,
  afterStyles = {},
  className = "",
  withCursor = false,
  onClick = () => {},
}) => {
  return (
    <div
      className={cx(styles.__wrapper, {
        [styles.__with_description]: description,
        [styles.__with_cursor]: withCursor,
        [className]: className,
      })}
      onClick={onClick}
    >
      <div className={styles.__wrapper_in}>
        {before ? <div className={styles.__before}>{before}</div> : null}
        <div className={styles.__content}>
          <div className={styles.__content_in}>
            <Text className={styles.__content_text}>{children}</Text>
          </div>
          {description ? (
            <div className={styles.__content_description}>
              <Text className={styles.__content_text}>{description}</Text>
            </div>
          ) : null}
        </div>
        {after ? (
          <div className={styles.__after} style={afterStyles}>
            {after}
          </div>
        ) : null}
      </div>
    </div>
  );
};
