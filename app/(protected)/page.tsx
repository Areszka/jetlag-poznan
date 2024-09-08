import { Suspense, JSX } from "react";
import { Questions } from "../ui/questions/questions";
import styles from "./page.module.css";
import Curses from "../ui/curses/curses";
import Game from "../ui/game";

export default async function Page(): Promise<JSX.Element> {
  return (
    <div className={styles.pageWrapper}>
      <Game />
      <Curses />
      <Suspense fallback={<p>Questions are loading... </p>}>
        <Questions />
      </Suspense>
    </div>
  );
}
