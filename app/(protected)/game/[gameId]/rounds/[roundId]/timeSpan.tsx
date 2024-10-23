"use client";
import { useServerLoading } from "@/app/hooks/use-server-loading";
import React from "react";

export default function TimeSpan({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date | undefined;
}) {
  const loading = useServerLoading();
  const [diff, setDiff] = React.useState(() => {
    const startTime = new Date(startDate).getTime();
    const endTime = endDate ? new Date(endDate).getTime() : new Date().getTime();

    return endTime - startTime;
  });

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (!endDate) {
      intervalId = setInterval(() => {
        const startTime = new Date(startDate).getTime();
        const endTime = new Date().getTime();
        const nextDiff = endTime - startTime;

        setDiff(nextDiff);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [endDate, startDate]);

  if (loading) {
    return "(...)";
  }
  return <span>{getGameDuration(diff)}</span>;
}

function getGameDuration(diff: number) {
  let ss = Math.floor(diff / 1000) % 60;
  let mm = Math.floor(diff / 1000 / 60) % 60;
  let hh = Math.floor(diff / 1000 / 60 / 60);

  return `(${hh < 10 ? "0" : ""}${hh}:${mm < 10 ? "0" : ""}${mm}:${ss < 10 ? "0" : ""}${ss})`;
}
