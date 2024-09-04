import { Suspense, JSX } from "react";
import { Questions } from "./ui/questions/questions";
import styles from "./page.module.css";
import Curses from "./ui/curses/curses";
import Game from "./ui/game";
import { Navigation } from "./ui/navigation";
import { validateSession } from "./api/auth";
import { db } from "@/app/api/db";

export default async function Page(): Promise<JSX.Element> {
  const userId = await validateSession();
  const user = await db.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  return (
    <>
      <Navigation username={user.username} />
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
