"use client";
import { PatchRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/start/route";
import { fetchWithBaseUrl, getTime } from "@/app/helpers";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./round.module.css";

export default function Timer({
  initialStartTime,
  initialEndTime,
}: {
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
  const router = useRouter();
  const params = useParams<{ gameId: string; roundId: string }>();

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
      router.refresh();
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
      router.refresh();
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
    <div className={styles.timerWrapepr}>
      <h1 className={styles.time}>{getTime(time)}</h1>
      {!startedAt && (
        <button className={styles.timerButton} onClick={startTimer}>
          Start timer
        </button>
      )}
      {startedAt && !endedAt && (
        <button className={styles.timerButton} onClick={stopTimer}>
          Stop timer
        </button>
      )}
    </div>
  );
}
