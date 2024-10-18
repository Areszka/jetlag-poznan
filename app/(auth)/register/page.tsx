"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "../../ui/components/card/card";
import Form from "../../ui/components/Form/Form";
import { Button } from "../../ui/components/button/button";
import useSWRMutation from "swr/mutation";
import CardError from "@/app/ui/components/card/CardError";
import Spinner from "@/app/ui/components/spinner/spinner";

async function register(url: string, { arg }: { arg: { username: string; password: string } }) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: arg.username,
      password: arg.password,
    }),
  }).then(async (res) => {
    if (res.ok) {
      return res.json();
    } else {
      if (res.status.toString().startsWith("4")) {
        const { error } = await res.json();
        throw new Error(error);
      } else {
        throw new Error(res.statusText);
      }
    }
  });
}

export default function Page() {
  const router = useRouter();
  const { trigger, isMutating, error } = useSWRMutation<any, Error, any, any>(
    "/api/register",
    register
  );

  return (
    <Card title="Register">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          trigger({
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
          }).then((_) => router.push("/"));
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
        <Button type="submit" disabled={isMutating}>
          {isMutating ? <Spinner /> : "Register"}
        </Button>
        <Link href="/login">I already have an account</Link>
      </Form>
      {error && <CardError>{error.message}</CardError>}
    </Card>
  );
}
