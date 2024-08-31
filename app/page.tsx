import { Suspense } from "react";
import { Questions } from "./ui/questions/questions";
import styles from "./page.module.css";
import Curses from "./ui/curses/curses";
import Game from "./ui/game";

export default function Page(): JSX.Element {
  return (
    <>
      <nav className={styles.navigation}>
        <p>Tu powstanie nawigacja.. kiedyś</p>
      </nav>
      <div className={styles.pageWrapper}>
        <Game></Game>
        <Curses />
        <Suspense fallback={<p>Questions are loading... </p>}>
          <Questions />
        </Suspense>
      </div>
    </>
  );
}
