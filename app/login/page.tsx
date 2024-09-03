"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <h1>Login</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: e.currentTarget.username.value,
              password: e.currentTarget.password.value,
            }),
          }).then((res) => {
            if (res.ok) {
              router.push("/");
            }
          });
        }}
      >
        <label>
          Username
          <input type="text" name="username" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
        <Link href="/register">I don&apos;t have an account</Link>
      </form>
    </div>
  );
}
