"use client";

import { useParams } from "next/navigation";
import GameButton from "./GameButton";
import { useSWRConfig } from "swr";

export default function StartRoundButton() {
  const params = useParams<{ gameId: string; roundId: string }>();
  const { mutate } = useSWRConfig();

  async function setGameStartTime() {
    const response = await fetch(`/api/games/${params.gameId}/rounds/${params.roundId}/start`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    mutate(`/api/games/${params.gameId}/rounds/${params.roundId}`);
  }

  return <GameButton onClick={setGameStartTime}>Start Game</GameButton>;
}
