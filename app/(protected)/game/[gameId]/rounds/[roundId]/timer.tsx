"use client";
import { PatchRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/start/route";
import { fetchWithBaseUrl } from "@/app/helpers";
import React from "react";
import NewRoundButton from "./newRoundButton";

export default function Timer({
  params,
  initialStartTime,
  initialEndTime,
}: {
  params: { gameId: string; roundId: string };
  initialStartTime: Date | undefined | null;
  initialEndTime: Date | undefined | null;
}) {
  const [startedAt, setStartedAt] = React.useState<Date | undefined | null>(initialStartTime);
  const [endedAt, setEndedAt] = React.useState<Date | undefined | null>(initialEndTime);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [time, setTime] = React.useState<number>(() => {
    const startTime = initialStartTime ?? new Date();
    const endTime = initialEndTime ? new Date(initialEndTime) : new Date();

    return new Date(endTime).getTime() - new Date(startTime).getTime();
  });

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;
    function calllback() {
      setTime((t) => t + 1000);
    }

    if (startedAt && !endedAt) {
      intervalId = setInterval(calllback, 1000);
    }

    return () => clearInterval(intervalId);
  }, [startedAt, endedAt]);

  async function startTimer() {
    const response = await fetchWithBaseUrl(
      `/api/games/${params.gameId}/rounds/${params.roundId}/start`,
      { method: "PATCH" }
    );

    if (response.ok) {
      const data: PatchRoundResponse = await response.json();
      setStartedAt(data.round.start_time);
    } else {
      console.info("ERROR WITH START TIME");
    }
  }

  async function stopTimer() {
    const response = await fetchWithBaseUrl(
      `/api/games/${params.gameId}/rounds/${params.roundId}/stop`,
      { method: "PATCH" }
    );

    if (response.ok) {
      const data: PatchRoundResponse = await response.json();
      setEndedAt(data.round.end_time);
    } else {
      console.info("ERROR WITH START TIME");
    }
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>{getTime(time)}</h1>
      <h1>Started at: {startedAt ? new Date(startedAt).toLocaleString() : "Start Game!"}</h1>
      <h1>Ended at: {endedAt ? new Date(endedAt).toLocaleString() : ""}</h1>
      {!startedAt && <button onClick={startTimer}>Start timer</button>}
      {startedAt && !endedAt && <button onClick={stopTimer}>Stop timer</button>}
      {endedAt && <NewRoundButton />}
    </div>
  );
}

function getTime(diff: number) {
  let ss = Math.floor(diff / 1000) % 60;
  let mm = Math.floor(diff / 1000 / 60) % 60;
  let hh = Math.floor(diff / 1000 / 60 / 60);

  return `${hh < 10 ? "0" : ""}${hh}h ${mm < 10 ? "0" : ""}${mm}m ${ss < 10 ? "0" : ""}${ss}s`;
}
