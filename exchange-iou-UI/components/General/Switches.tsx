import React from "react";

type Props = {
  id: string;
  theme?: string;
  title: string;
  [key: string]: any;
};

export default function Switches({ id, theme, title, ...restProps }: Props) {
  return (
    <div className={`form-check form-switch ${theme && "form-switch-" + theme}`}>
      <input className="form-check-input" type="checkbox" id={id} {...restProps} />
      <label className="form-check-label" htmlFor={id}>
        {title}
      </label>
    </div>
  );
}
