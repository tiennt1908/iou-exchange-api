import React from "react";
import SidebarItem from "./navBar";
import NavBar from "./navBar";
import Logo from "./Logo";

type Props = {};

export default function Sidebar({}: Props) {
  return (
    <div className="app-menu navbar-menu d-none d-lg-block">
      {/* LOGO */}
      <Logo></Logo>
      <div className="h-100">
        <div className="simplebar-wrapper">
          <NavBar></NavBar>
        </div>
      </div>
      <div className="sidebar-background" />
    </div>
  );
}
