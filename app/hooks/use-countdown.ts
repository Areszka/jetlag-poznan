"use client";
import React from "react";

export default function useCountdown({ period, startTime }: { period: number; startTime: Date }) {
  const [remainingTime, setRemainingTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const nextRemainingTime =
      period - (new Date().getTime() - new Date(startTime).getTime()) + 1000;

    if (nextRemainingTime > 0) {
      intervalId = setInterval(() => {
        const n = period - (new Date().getTime() - new Date(startTime).getTime()) + 1000;
        setRemainingTime(n);
        if (n <= 0) {
          clearInterval(intervalId);
        }
      }, 1000);
    } else {
      setRemainingTime(0);
    }

    return () => clearInterval(intervalId);
  }, [period, startTime]);

  return remainingTime;
}
