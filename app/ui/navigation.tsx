"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css";

export function Navigation() {
  const router = useRouter();
  return (
    <nav className={styles.navigation}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/register">Register</Link>
        </li>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/logout", {
              method: "POST",
            }).then((res) => {
              if (res.ok) {
                router.push("/");
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
