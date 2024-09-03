import { Suspense, JSX } from "react";
import { Questions } from "./ui/questions/questions";
import styles from "./page.module.css";
import Curses from "./ui/curses/curses";
import Game from "./ui/game";
import { Navigation } from "./ui/navigation";
import { cookies } from "next/headers";
import { validateSession } from "./api/auth";

export default async function Page(): Promise<JSX.Element> {
  const jetlagSession = cookies().get("jetlag_session")?.value;

  const userId = await validateSession(jetlagSession);

  return (
    <>
      <Navigation userId={userId} />
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
