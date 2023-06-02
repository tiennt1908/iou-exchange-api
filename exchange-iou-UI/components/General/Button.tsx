import React, { ReactElement, ReactNode } from "react";

type Props = {
  type: "button" | "submit" | "reset";
  children: ReactNode;
  theme: string;
  loading?: boolean;
  className?: string;
  [x: string]: any;
};

export default function Button({ theme, type, loading, children, className, ...restProps }: Props) {
  return (
    <button
      type={type}
      className={`btn btn-${theme} d-flex align-items-center justify-content-center ${className}`}
      {...restProps}
    >
      {loading && (
        <span
          className="spinner-border flex-shrink-0 me-2"
          role="status"
          style={{ width: 18, height: 18 }}
        />
      )}
      {children}
    </button>
  );
}
