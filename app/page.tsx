import { Suspense, JSX } from "react";
import { Questions } from "./ui/questions/questions";
import styles from "./page.module.css";
import Curses from "./ui/curses/curses";
import Game from "./ui/game";
import { Navigation } from "./ui/navigation";

export default function Page(): JSX.Element {
  return (
    <>
      <Navigation />
      <div className={styles.pageWrapper}>
        <Game />
        <Curses />
        <Suspense fallback={<p>Questions are loading... </p>}>
          <Questions />
        </Suspense>
      </div>
    </>
  );
}
