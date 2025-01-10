"use client";

import React, { ReactNode } from "react";
import useSWR from "swr";
import { GetGameResponse } from "@/app/api/games/[gameId]/route";
import { useParams } from "next/navigation";
import { fetcher } from "@/app/helpers";
import Spinner from "@/app/ui/components/spinner/spinner";
import Center from "@/app/ui/components/Center/Center";
import GridSkeleton from "./GridSkeleton";

const GameContext = React.createContext<GetGameResponse | null>(null);

export function useGameContext() {
  const context = React.useContext(GameContext);

  if (!context) {
    throw new Error("No game context!");
  }

  return context;
}

export default function GameProvider({ children }: { children: ReactNode }) {
  const params: { gameId: string; roundId: string } = useParams();

  const { data, isLoading, error } = useSWR<GetGameResponse, any, any, any>(
    `/api/games/${params.gameId}`,
    fetcher
  );

  if (error) {
    return (
      <GridSkeleton>
        <Center>Error when fetching game</Center>
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
        <Center>No game data</Center>
      </GridSkeleton>
    );
  }

  return <GameContext.Provider value={{ game: data.game }}>{children}</GameContext.Provider>;
}
