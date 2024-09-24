"use client";
import { fetchWithBaseUrl, timeToMinutesAndSeconds } from "@/app/helpers";
import { useParams, useRouter } from "next/navigation";
import GameButton from "./GameButton";
import React from "react";
import useCountdown from "@/app/hooks/use-countdown";

export default function StopRoundButton({
  startTime,
  jailPeriod,
}: {
  startTime: Date;
  jailPeriod: number;
}) {
  const params = useParams<{ gameId: string; roundId: string }>();
  const router = useRouter();
  const jailTimeLeft = useCountdown({ period: jailPeriod, startTime });

  async function setGameStopTime() {
    const response = await fetchWithBaseUrl(
      `/api/games/${params.gameId}/rounds/${params.roundId}/stop`,
      { method: "PATCH" }
    );

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
