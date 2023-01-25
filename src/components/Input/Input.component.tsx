import { FC, useRef } from "react";
import cx from "classnames";

import { InputProps } from "./Input.types";

import styles from "./Input.module.css";

export const Input: FC<InputProps> = ({
  disabled,
  defaultValue,
  value,
  after,
  indicator,
  readonly,
  placeholder,
  selectAll,
  type = "text",
  className = "",
  onChange = () => {},
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onInputValueClick = () => {
    if (!selectAll) {
      return;
    }

    return inputRef.current && inputRef.current.select();
  };

  return (
    <div
      className={cx(styles.__wrapper, {
        [styles.__disabled]: disabled,
        [className]: className,
      })}
    >
      <div className={styles.__wrapper_in}>
        <input
          ref={inputRef}
          className={styles.__content}
          onChange={onChange}
          readOnly={readonly}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          placeholder={placeholder}
          spellCheck={false}
          type={type}
          onClick={onInputValueClick}
        />
        {indicator ? (
          <div className={styles.__indicator}>{indicator}</div>
        ) : null}
        {after ? <div className={styles.__after}>{after}</div> : null}
      </div>
    </div>
  );
};
