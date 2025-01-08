import styles from "./BottomNavigation.module.css";
import { FaHouse, FaMeteor, FaRectangleList, FaAlignLeft } from "react-icons/fa6";
import { ActiveCursesBadge, PendingQuestionsBadge } from "./Badges";
import NavItem from "./NavItem";

export default async function BottomNavigation({
  params,
}: {
  params: { gameId: string; roundId: string };
}) {
  const iconSize = "24px";
  return (
    <nav className={styles.nav}>
      <NavItem href="/" icon={<FaHouse size={iconSize} />}>
        Home
      </NavItem>
      <NavItem
        href={`/game/${params.gameId}/rounds/${params.roundId}/questions`}
        icon={<FaRectangleList size={iconSize} />}
        badge={<PendingQuestionsBadge params={params} />}
      >
        Questions
      </NavItem>
      <NavItem
        href={`/game/${params.gameId}/rounds/${params.roundId}/curses`}
        icon={<FaMeteor size={iconSize} />}
        badge={<ActiveCursesBadge params={params} />}
      >
        Curses
      </NavItem>
      <NavItem
        href={`/game/${params.gameId}/rounds/${params.roundId}/rules`}
        icon={<FaAlignLeft size={iconSize} />}
      >
        Rules
      </NavItem>
    </nav>
  );
}
