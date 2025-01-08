"use client";

import { useRoundContext } from "./RoundProvider";

export default function Winner() {
  const { round } = useRoundContext();

  if (!round.winner_id) {
    return;
  }

  const winnerTeam = round.teams.find((team) => team.id === round.winner_id);

  if (!winnerTeam) {
    throw Error("Winner not found");
  }

  return (
    <p>
      Winner: {winnerTeam.name} ({winnerTeam.members.map((m) => m.username).join(", ")})
    </p>
  );
}
