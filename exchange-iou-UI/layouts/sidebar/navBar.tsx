import Link from "next/link";
import React, { ReactElement } from "react";
import NavItem from "./navItem";

export default function NavBar() {
  const data = [
    {
      id: 1,
      name: "Overview",
      href: "",
      icon: "ri-rocket-line",
      child: [
        {
          id: 2,
          name: "Top Tokens",
          href: "/tokens",
        },
        {
          id: 3,
          name: "Create Token IOU",
          href: "/iou/create",
        },
        {
          id: 4,
          name: "My Orders",
          href: "/iou/my-orders",
        },
        {
          id: 5,
          name: "My Tokens IOU",
          href: "/iou/my-tokens-iou",
        },
      ],
    },
  ];
  return (
    <ul className="navbar-nav">
      {data.map((e, k) => {
        return <NavItem key={e.id} {...e} />;
      })}
    </ul>
  );
}
