"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "../../ui/components/card/card";
import Form from "../../ui/components/Form/Form";
import { Button } from "../../ui/components/button/button";
import React from "react";
import useSWRMutation from "swr/mutation";
import { LoginRequest, LoginResponse } from "@/app/api/login/route";
import CardError from "@/app/ui/components/card/CardError";

async function login(url: string, { arg }: { arg: LoginRequest }) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
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
  const { trigger, isMutating, error } = useSWRMutation<LoginResponse, Error, any, LoginRequest>(
    "/api/login",
    login
  );

  return (
    <Card title="Login">
      <Form
        onSubmit={async (e) => {
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
          {isMutating ? "Loading..." : "Login"}
        </Button>
        <Link href="/register">I don&apos;t have an account</Link>
      </Form>
      {error && <CardError>{error.message}</CardError>}
    </Card>
  );
}
