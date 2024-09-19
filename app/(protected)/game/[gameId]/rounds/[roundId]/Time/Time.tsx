"use client";

import { getTime } from "@/app/helpers";
import React from "react";
import styles from "./Time.module.css";
import { useServerLoading } from "@/app/hooks/use-server-loading";
import usePolling from "@/app/hooks/use-polling";

type Props = { startTime: null | Date; endTime: null | Date };

export default function Time({ startTime, endTime }: Props) {
  usePolling(3000);

  const isLoading = useServerLoading();
  const [time, setTime] = React.useState<number>(() => {
    if (endTime) {
      return new Date(endTime).getTime() - new Date(startTime!).getTime();
    }
    if (startTime) {
      return new Date().getTime() - new Date(startTime).getTime();
    }

    return 0;
  });

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (startTime && !endTime) {
      intervalId = setInterval(() => {
        const nextTime = new Date().getTime() - new Date(startTime).getTime();
        setTime(nextTime);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [startTime, endTime]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <h1 className={styles.time}>{getTime(time)}</h1>;
}
