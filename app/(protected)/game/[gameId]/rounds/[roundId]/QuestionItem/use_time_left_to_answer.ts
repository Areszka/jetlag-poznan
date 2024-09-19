import React from "react";

export default function useTimeLeftToAnswer({
  askedAt,
  timeLimitToAnswerQuestion,
}: {
  askedAt: Date;
  timeLimitToAnswerQuestion: number;
}) {
  const [timeLeftToAnswer, setTimeLeftToAnswer] = React.useState<number | null>(null);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (askedAt) {
      const nextTimeLeftToAnswer =
        timeLimitToAnswerQuestion - (new Date().getTime() - new Date(askedAt).getTime()) + 1000;

      if (nextTimeLeftToAnswer > 0) {
        intervalId = setInterval(() => {
          const n =
            timeLimitToAnswerQuestion - (new Date().getTime() - new Date(askedAt).getTime()) + 1000;
          setTimeLeftToAnswer(n);
        }, 1000);
      }
    }

    return () => clearInterval(intervalId);
  }, [askedAt, timeLimitToAnswerQuestion]);

  return timeLeftToAnswer;
}
