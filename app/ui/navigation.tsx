import Link from "next/link";
import styles from "./navigation.module.css";
import { Button } from "@/app/ui/components/button/button";

export function Navigation({ username }: { username: string }) {
  return (
    <div className={styles.navigation}>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
        </ul>
      </nav>
      <form method="post" action="/api/logout" className={styles.loggedInUser}>
        <p>Logged in as: {username}</p>
        <Button>Logout</Button>
      </form>
    </div>
  );
}
