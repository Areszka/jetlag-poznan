"use client";
import { fetchWithBaseUrl, timeToMinutesAndSeconds } from "@/app/helpers";
import { useRouter } from "next/navigation";
import GameButton from "./GameButton";
import React from "react";
import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "../TeamProvider";

export default function StopRoundButton() {
  const { round, userTeam } = useRoundContext();
  const router = useRouter();
  const jailTimeLeft = useCountdown({
    period: round.game.jail_duration,
    startTime: round.start_time!,
  });

  async function setGameStopTime() {
    const response = await fetchWithBaseUrl(`/api/games/${round.gameId}/rounds/${round.id}/stop`, {
      method: "PATCH",
      body: JSON.stringify({
        winnerTeamId: userTeam.teamId,
      }),
    });

    if (!response.ok) {
      throw new Error("Ops... couldn't stop the time!");
    }
    router.refresh();
  }

  let buttonText;

  if (jailTimeLeft === null) {
    buttonText = `Jail period: ...`;
  } else if (jailTimeLeft > 0) {
    buttonText = `Jail period: ${timeToMinutesAndSeconds(jailTimeLeft)}`;
  } else {
    buttonText = "Stop Game";
  }

  return (
    <GameButton disabled={jailTimeLeft === null || jailTimeLeft > 0} onClick={setGameStopTime}>
      {buttonText}
    </GameButton>
  );
}
