"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <h1>Register</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetch("/api/register", {
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
        <button type="submit">Register</button>
        <Link href="/login">I already have an account</Link>
      </form>
    </div>
  );
}
