"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { IconType } from "react-icons";
import { FaHouse, FaMeteor, FaRectangleList, FaAlignLeft } from "react-icons/fa6";
import { ReactNode } from "react";
import { ActiveCursesBadge, PendingQuestionsBadge } from "./ClientBadges";
import { usePathname } from "next/navigation";

export default function Navbar({ params }: { params: { gameId: string; roundId: string } }) {
  return (
    <nav className={styles.nav}>
      <NavItem href="/" icon={FaHouse}>
        Home
      </NavItem>
      <NavItem
        href={`/game/${params.gameId}/rounds/${params.roundId}/questions`}
        icon={FaRectangleList}
        badge={<PendingQuestionsBadge params={params} />}
      >
        Questions
      </NavItem>
      <NavItem
        href={`/game/${params.gameId}/rounds/${params.roundId}/curses`}
        icon={FaMeteor}
        badge={<ActiveCursesBadge params={params} />}
      >
        Curses
      </NavItem>
      <NavItem href={`/game/${params.gameId}/rounds/${params.roundId}/rules`} icon={FaAlignLeft}>
        Rules
      </NavItem>
    </nav>
  );
}

type NavItemProps = {
  children: string;
  icon: IconType;
  href: string;
  badge?: ReactNode;
};

export function NavItem({ children, icon: Icon, href, badge }: NavItemProps) {
  const pathname = usePathname().split("/").at(-1);

  const itemIsActive = pathname === children.toLowerCase();

  return (
    <Link href={href} className={`${styles.navItem} ${itemIsActive ? styles.activeNavItem : ""}`}>
      <Icon size="24px" />
      <p>{children}</p>
      {badge && badge}
    </Link>
  );
}

export function Badge({ children }: { children: string }) {
  return <div className={styles.badge}>{children}</div>;
}
