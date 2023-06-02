import React from "react";
import TokenLogo from "../../components/General/TokenLogo";

type Props = {};

export default function Logo({}: Props) {
  return (
    <div className="navbar-brand-box">
      {/* Dark Logo*/}
      <a href="index.html" className="logo logo-dark">
        <span className="logo-sm">{/* <img src="assets/images/logo-sm.png" height={22} /> */}</span>
        <span className="logo-lg">
          <TokenLogo alt="Logo" height={47.7} width={139.5} imgURL="/img/logo.webp" />
        </span>
      </a>
      {/* Light Logo*/}
      <a href="index.html" className="logo logo-light">
        <span className="logo-sm">{/* <img src="assets/images/logo-sm.png" height={22} /> */}</span>
        <span className="logo-lg">
          {/* <img src="assets/images/logo-light.png" height={17} /> */}
        </span>
      </a>
    </div>
  );
}
