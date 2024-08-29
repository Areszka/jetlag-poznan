"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function UserWrapper({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <p>You are being logged in...</p>;
  if (error) return <p>Error!</p>;
  if (user) return children;

  return (
    <div>
      <a href="/api/auth/login">Log in!</a>
    </div>
  );
}
