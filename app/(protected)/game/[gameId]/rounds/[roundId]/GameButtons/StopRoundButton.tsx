"use client";
import { fetchWithBaseUrl, timeToMinutesAndSeconds } from "@/app/helpers";
import { useParams, useRouter } from "next/navigation";
import GameButton from "./GameButton";
import React from "react";

const JAIL_PERIOD = 1000 * 60 * 10;

export default function StopRoundButton({ startTime }: { startTime: Date }) {
  const params = useParams<{ gameId: string; roundId: string }>();
  const router = useRouter();

  const [jailTimeLeft, setJailTimeLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const nextJailTimeLeft =
      JAIL_PERIOD - (new Date().getTime() - new Date(startTime).getTime()) + 1000;

    if (nextJailTimeLeft > 0) {
      intervalId = setInterval(() => {
        const n = JAIL_PERIOD - (new Date().getTime() - new Date(startTime).getTime()) + 1000;
        setJailTimeLeft(n);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, []);

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
