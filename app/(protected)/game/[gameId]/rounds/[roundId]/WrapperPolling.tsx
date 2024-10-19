"use client";
import usePolling from "@/app/hooks/use-polling";
import { ReactNode } from "react";

export default function PollingWrapper({ children }: { children: ReactNode }) {
  usePolling(3000);
  return <>{children}</>;
}
