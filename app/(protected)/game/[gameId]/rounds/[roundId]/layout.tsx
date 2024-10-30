import styles from "./round.module.css";
import { BottomNavigation, TopNavigation } from "./components/Navbar/Navbar";
import RoundProvider from "./RoundProvider";
import GameProvider from "./GameProvider";

export default async function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <GameProvider>
        <RoundProvider>
          <TopNavigation />
          <div className={styles.pageWrapper}>{children}</div>
        </RoundProvider>
      </GameProvider>
      <BottomNavigation />
    </>
  );
}
