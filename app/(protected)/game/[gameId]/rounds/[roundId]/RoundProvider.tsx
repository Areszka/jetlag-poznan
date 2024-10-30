"use client";

import { GetRoundResponseTemp } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import { fetcher } from "@/app/helpers";
import { useParams } from "next/navigation";
import React, { ReactNode } from "react";
import useSWR from "swr";

const RoundContext = React.createContext<GetRoundResponseTemp | null>(null);

export default function RoundProvider({ children }: { children: ReactNode }) {
  const params: { gameId: string; roundId: string } = useParams();

  const { data, isLoading, error } = useSWR<GetRoundResponseTemp, any, any, any>(
    `/api/games/${params.gameId}/rounds/${params.roundId}`,
    fetcher
  );

  if (error) {
    return <p>Error when fetching rounds</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No round context data</p>;
  }

  return <RoundContext.Provider value={{ round: data.round }}>{children}</RoundContext.Provider>;
}

export function useRoundContext() {
  const context = React.useContext(RoundContext);

  if (!context) {
    throw new Error("No round context!");
  }

  return context;
}
