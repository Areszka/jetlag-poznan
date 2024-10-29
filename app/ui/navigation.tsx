import Link from "next/link";
import styles from "./navigation.module.css";
import { Button } from "@/app/ui/components/button/button";
import { validateSession } from "../api/auth";
import { db } from "@/app/api/db";

export async function Navigation() {
  const userId = await validateSession();
  const { username } = await db.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

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
