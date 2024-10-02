"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "../../ui/components/card/card";
import Form from "../../ui/components/Form/Form";
import { Button } from "../../ui/components/button/button";

export default function Page() {
  const router = useRouter();
  return (
    <Card title="Login">
      <Form
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
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <Button type="submit">Login</Button>
        <Link href="/register">I don&apos;t have an account</Link>
      </Form>
    </Card>
  );
}
