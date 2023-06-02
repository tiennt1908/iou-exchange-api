import Link from "next/link";
import React from "react";

type ChildMenu = {
  id: number;
  name: string;
  href: string;
};
type Props = {
  id: number;
  name: string;
  href: string;
  icon?: string;
  child: ChildMenu[];
};

export default function NavItem({ id, name, href, icon, child }: Props) {
  return (
    <li className="nav-item">
      <div className={"nav-link collapsed "}>
        {icon && <i className={icon}></i>}
        <span>{name}</span>
      </div>
      <div className="collapse menu-dropdown show">
        <ul className="nav nav-sm flex-column">
          {child.map((e) => {
            return (
              <li className="nav-item" key={e.id}>
                <Link href={e.href} className="nav-link">
                  {e.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
