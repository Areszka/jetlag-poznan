"use client";

import styles from "./BottomNavigation.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavItemProps = {
  children: string;
  icon: ReactNode;
  href: string;
  badge?: ReactNode;
};

export default function NavItem({ children, icon, href, badge }: NavItemProps) {
  const pathname = usePathname().split("/").at(-1);
  const itemIsActive = pathname === children.toLowerCase();

  return (
    <Link href={href} className={`${styles.navItem} ${itemIsActive ? styles.activeNavItem : ""}`}>
      {icon}
      <p>{children}</p>
      {badge && badge}
    </Link>
  );
}
