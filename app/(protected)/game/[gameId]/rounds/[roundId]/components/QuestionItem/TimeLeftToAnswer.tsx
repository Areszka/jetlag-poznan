"use client";

import { timeToMinutesAndSeconds } from "@/app/helpers";
import styles from "./QuestionItem.module.css";
import useCountdown from "@/app/hooks/use-countdown";
import { useGameContext } from "../../GameProvider";

export default function TimeLeftToAnswer({ askedAt }: { askedAt: Date }) {
  const { game } = useGameContext();
  const timeLeftToAnswer = useCountdown({
    startTime: askedAt,
    period: game.answer_time_limit,
  });

  return (
    <p className={styles.timeToAnswer}>
      Time left to answer:{" "}
      {!timeLeftToAnswer ? "--:--" : timeToMinutesAndSeconds(Math.max(timeLeftToAnswer, 0))}
    </p>
  );
}
