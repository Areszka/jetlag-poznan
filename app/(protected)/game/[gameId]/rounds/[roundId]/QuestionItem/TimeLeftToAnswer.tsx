"use client";

import { timeToMinutesAndSeconds } from "@/app/helpers";
import useTimeLeftToAnswer from "./use_time_left_to_answer";
import styles from "./QuestionItem.module.css";

export default function TimeLeftToAnswer({
  askedAt,
  timeLimitToAnswerQuestion,
}: {
  askedAt: Date;
  timeLimitToAnswerQuestion: number;
}) {
  const timeLeftToAnswer = useTimeLeftToAnswer({ askedAt, timeLimitToAnswerQuestion });

  return (
    <p className={styles.timeToAnswer}>
      Time left to answer:{" "}
      {!timeLeftToAnswer ? "--:--" : timeToMinutesAndSeconds(Math.max(timeLeftToAnswer, 0))}
    </p>
  );
}
