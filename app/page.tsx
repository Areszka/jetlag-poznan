import { Suspense } from "react";
import { Questions } from "./ui/questions/questions";
import styles from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <>
      <nav className={styles.navigation}>
        <a href="/api/auth/logout">Logout</a>
      </nav>
      <div className={styles.pageWrapper}>
        <Suspense fallback={<p>Questions are loading... </p>}>
          <Questions />
        </Suspense>
      </div>
    </>
  );
}
