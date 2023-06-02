import React from "react";

type Props = {
  title?: string;
  icon?: {
    position?: "right";
    class: string;
    color?: string;
  };
  error?: string;
  className?: string;
  [key: string]: any;
};

export default function Input({ title, icon, className, error, ...restProps }: Props) {
  return (
    <>
      <label className="form-label">{title}</label>
      <div className={`w-100 form-icon ${icon?.position}`}>
        <input
          {...restProps}
          className={`form-control ${error && "border-danger"} ${
            icon && "form-control-icon"
          } ${className}`}
          onWheel={(e: any) => {
            e.target.blur();
          }}
        />
        {icon && <i className={icon.class} style={{ color: icon.color }}></i>}
      </div>
      {error && <span className="mt-1 text-danger">{error}</span>}
    </>
  );
}
