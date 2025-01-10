import styles from "./layout.module.css";
import RoundProvider from "./components/RoundProvider";
import GameProvider from "./components/GameProvider";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";
import RoundsNavigation from "./components/RoundsNavigation/RoundsNavigation";
import { TopNavigation } from "./components/TopNavigation/TopNavigation";

export default function Layout({
  children,
  params,
}: {
  children: JSX.Element;
  params: { gameId: string; roundId: string };
}) {
  return (
    <div className={styles.grid}>
      <GameProvider>
        <RoundProvider>
          <TopNavigation />
          <RoundsNavigation params={params} />
          <main className={styles.pageContentWrapper}>{children}</main>
        </RoundProvider>
      </GameProvider>
      <BottomNavigation params={params} />
    </div>
  );
}
