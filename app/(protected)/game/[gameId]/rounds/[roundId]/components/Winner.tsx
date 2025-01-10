"use client";

import Header from "@/app/ui/components/header/header";
import { useRoundContext } from "./RoundProvider";
import Item from "@/app/ui/components/Item/Item";
import { Text } from "@/app/ui/components/text/text";

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
    <div>
      <Header>Winner 🎊 🎉</Header>
      <Item>
        <Text type="title">{winnerTeam.name}</Text>
        <Text type="description">{winnerTeam.members.map((m) => m.username).join(", ")}</Text>
      </Item>
    </div>
  );
}
