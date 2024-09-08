import { Suspense, JSX } from "react";
import { Questions } from "../ui/questions/questions";
import { Curses } from "../ui/curses/curses";
import styles from "./page.module.css";
import ThrowCurse from "@/app/ui/throw-curse/throw-curse";
import Game from "../ui/game";

export default async function Page(): Promise<JSX.Element> {
  return (
    <div className={styles.pageWrapper}>
      <Game />
      <ThrowCurse />
      <Suspense fallback={<p>Questions are loading... </p>}>
        <Questions />
      </Suspense>
      <Suspense fallback={<p>Curses are loading... </p>}>
        <Curses />
      </Suspense>
    </div>
  );
}
