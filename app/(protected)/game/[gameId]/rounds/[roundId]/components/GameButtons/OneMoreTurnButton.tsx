"use client";
import { fetchWithBaseUrl } from "@/app/helpers";
import { useParams, useRouter } from "next/navigation";
import { PostRoundResponse } from "@/app/api/games/[gameId]/rounds/create/route";
import GameButton from "./GameButton";

export default function OneMoreTurnButton() {
  const params = useParams<{ gameId: string }>();
  const router = useRouter();

  async function createAndGoToNextRound() {
    const response = await fetchWithBaseUrl(`/api/games/${params.gameId}/rounds/create`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const { round }: PostRoundResponse = await response.json();
    router.push(`/game/${params.gameId}/rounds/${round.id}`);
    router.refresh();
  }

  return <GameButton onClick={createAndGoToNextRound}>One More Turn!</GameButton>;
}
