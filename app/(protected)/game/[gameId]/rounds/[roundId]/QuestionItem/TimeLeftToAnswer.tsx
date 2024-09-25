"use client";

import { timeToMinutesAndSeconds } from "@/app/helpers";
import styles from "./QuestionItem.module.css";
import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "../TeamProvider";

export default function TimeLeftToAnswer({ askedAt }: { askedAt: Date }) {
  const { round } = useRoundContext();
  const timeLeftToAnswer = useCountdown({
    startTime: askedAt,
    period: round.game.answer_time_limit,
  });

  return (
    <p className={styles.timeToAnswer}>
      Time left to answer:{" "}
      {!timeLeftToAnswer ? "--:--" : timeToMinutesAndSeconds(Math.max(timeLeftToAnswer, 0))}
    </p>
  );
}
