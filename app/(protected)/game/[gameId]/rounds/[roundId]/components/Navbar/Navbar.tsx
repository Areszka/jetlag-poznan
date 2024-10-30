"use client";
import styles from "./Navbar.module.css";
import { FaHouse, FaMeteor, FaRectangleList, FaAlignLeft, FaRegClock } from "react-icons/fa6";
import { ReactNode } from "react";
import { ActiveCursesBadge, PendingQuestionsBadge } from "./ClientBadges";
import useGameTime from "@/app/hooks/use-game-time";
import { useRoundContext } from "../../RoundProvider";
import { getTime } from "@/app/helpers";
import GameControlButton from "../GameButtons/GameControlButton";
import { IconType } from "react-icons";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export function TopNavigation() {
  const { round } = useRoundContext();
  const time = useGameTime({ endTime: round.end_time, startTime: round.start_time });

  return (
    <Navbar side="top">
      <div className={styles.timer}>
        <FaRegClock size="24px" />
        <p>{getTime(time)}</p>
      </div>
      <GameControlButton />
    </Navbar>
  );
}

export function BottomNavigation() {
  const params: { gameId: string; roundId: string } = useParams();

  return (
    <Navbar side="bottom">
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
    </Navbar>
  );
}

type Side = "top" | "bottom";

function Navbar({ children, side }: { children: ReactNode; side: Side }) {
  return <nav className={`${styles.nav} ${styles[side]}`}>{children}</nav>;
}

export function Badge({ children }: { children: string }) {
  return <div className={styles.badge}>{children}</div>;
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
