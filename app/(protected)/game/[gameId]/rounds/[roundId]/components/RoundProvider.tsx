"use client";

import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import { fetcher } from "@/app/helpers";
import Center from "@/app/ui/components/Center/Center";
import Spinner from "@/app/ui/components/spinner/spinner";
import { useParams } from "next/navigation";
import React, { ReactNode } from "react";
import useSWR from "swr";
import GridSkeleton from "./GridSkeleton";

const RoundContext = React.createContext<GetRoundResponse | null>(null);

export default function RoundProvider({ children }: { children: ReactNode }) {
  const params: { gameId: string; roundId: string } = useParams();

  const { data, isLoading, error } = useSWR<GetRoundResponse, any, any, any>(
    `/api/games/${params.gameId}/rounds/${params.roundId}`,
    fetcher,
    { refreshInterval: 3000 }
  );

  if (error) {
    return (
      <GridSkeleton>
        <Center>Error when fetching rounds</Center>
      </GridSkeleton>
    );
  }

  if (isLoading) {
    return (
      <GridSkeleton>
        <Center>
          <Spinner size="24px" />
        </Center>
      </GridSkeleton>
    );
  }

  if (!data) {
    return (
      <GridSkeleton>
        <Center>No round context data</Center>
      </GridSkeleton>
    );
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
