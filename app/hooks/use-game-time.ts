"use client";

import React from "react";

export default function useGameTime({
  startTime,
  endTime,
}: {
  startTime: null | Date;
  endTime: null | Date;
}) {
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

  return time;
}
