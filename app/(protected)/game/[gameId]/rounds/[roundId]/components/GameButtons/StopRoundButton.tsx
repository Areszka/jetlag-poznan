"use client";
import { timeToMinutesAndSeconds } from "@/app/helpers";
import GameButton from "./GameButton";
import React from "react";
import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "../../RoundProvider";
import { useGameContext } from "../../GameProvider";
import useUserTeam from "@/app/hooks/use_user_team";
import { useSWRConfig } from "swr";

export default function StopRoundButton() {
  const { round } = useRoundContext();
  const { game } = useGameContext();
  const { userTeam } = useUserTeam();
  const { mutate } = useSWRConfig();

  const jailTimeLeft = useCountdown({
    period: game.jail_duration,
    startTime: round.start_time!,
  });

  async function setGameStopTime() {
    const response = await fetch(`/api/games/${round.gameId}/rounds/${round.id}/stop`, {
      method: "PATCH",
      body: JSON.stringify({
        winnerTeamId: userTeam.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Ops... couldn't stop the time!");
    }
    mutate(`/api/games/${round.gameId}/rounds/${round.id}`);
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
