"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css";

export function Navigation({ userId }: { userId: string }) {
  const router = useRouter();
  return (
    <nav className={styles.navigation}>
      {userId}
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/logout", {
              method: "POST",
            }).then((res) => {
              if (res.ok) {
                router.push("/login");
              }
            });
          }}
        >
          Logout
        </button>
      </ul>
    </nav>
  );
}
