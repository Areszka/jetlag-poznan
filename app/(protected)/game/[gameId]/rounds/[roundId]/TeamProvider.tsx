"use client";

import { ExpandedRound, FlatTeamRound } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import React from "react";

const TeamContext = React.createContext<{
  userTeam: FlatTeamRound;
  round: ExpandedRound;
} | null>(null);

export default function TeamProvider({
  children,
  userId,
  round,
}: {
  children: JSX.Element;
  userId: string;
  round: ExpandedRound;
}) {
  const userTeam = round.teams.find((team) => team.members.some(({ id }) => id === userId));

  if (!userTeam) {
    throw new Error("No Team found");
  }

  return <TeamContext.Provider value={{ userTeam, round }}>{children}</TeamContext.Provider>;
}

export function useRoundContext() {
  const context = React.useContext(TeamContext);

  if (!context) {
    throw new Error("No context!");
  }

  return context;
}
