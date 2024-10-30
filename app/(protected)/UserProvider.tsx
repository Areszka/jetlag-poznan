"use client";

import React, { ReactNode } from "react";

const UserContext = React.createContext<{ user: { username: string; id: string } } | null>(null);

export default function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: { username: string; id: string };
}) {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error("No user context!");
  }

  return context;
}
