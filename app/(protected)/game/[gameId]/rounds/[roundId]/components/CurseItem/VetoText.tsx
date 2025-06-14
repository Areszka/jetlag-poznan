"use client";

import { formatTime } from "@/app/helpers";
import useCountdown from "@/app/hooks/use-countdown";
import styles from "./TeamCurseItem.module.css";

export default function VetoText({ vetoedAt }: { vetoedAt: Date }) {
  const timeLeftVeto = useCountdown({
    startTime: vetoedAt,
    period: 1000 * 60 * 15,
  });

  if (timeLeftVeto !== null && timeLeftVeto <= 0) {
    return;
  }

  return (
    <p className={styles.vetoText}>VETOED {timeLeftVeto ? formatTime(timeLeftVeto) : "--:--"}</p>
  );
}
