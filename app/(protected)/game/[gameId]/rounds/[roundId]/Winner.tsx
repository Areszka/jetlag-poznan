"use client";

import { useRoundContext } from "./TeamProvider";

export default function Winner() {
  const { round } = useRoundContext();

  if (!round.winner_id) {
    return;
  }

  const winnerTeam = round.teams.find((team) => team.teamId === round.winner_id);
  return (
    <p>
      Winner: {winnerTeam?.name} ({winnerTeam?.members.map((m) => m.username).join(", ")})
    </p>
  );
}
