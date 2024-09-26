"use client";

import { fetchWithBaseUrl } from "@/app/helpers";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./QuestionItem.module.css";
import useCountdown from "@/app/hooks/use-countdown";

export default function AnswerForm({
  askedAt,
  questionId,
  timeLimitToAnswerQuestion,
  ownerTeamId,
}: {
  questionId: string;
  askedAt: Date;
  askedBy?: string;
  timeLimitToAnswerQuestion: number;
  ownerTeamId?: string;
}) {
  const timeLeftToAnswer = useCountdown({ startTime: askedAt, period: timeLimitToAnswerQuestion });
  const router = useRouter();

  React.useEffect(() => {
    async function sendDefaultAnswer() {
      const response = await fetchWithBaseUrl(
        `/api/questions/answer/${ownerTeamId}/${questionId}`,
        {
          body: JSON.stringify({ answer: "Hiders didn't manage to answer before time ran out" }),
          method: "POST",
        }
      );

      if (!response.ok) {
        throw Error("Error when answering");
      }
      router.refresh();
    }

    const nextTimeLeftToAnswer =
      timeLimitToAnswerQuestion - (new Date().getTime() - new Date(askedAt).getTime()) + 1000;

    if (askedAt && nextTimeLeftToAnswer <= 1000 && (timeLeftToAnswer ?? 0) <= 0) {
      sendDefaultAnswer();
    }
  }, [askedAt, timeLeftToAnswer, timeLimitToAnswerQuestion, ownerTeamId, questionId, router]);

  return (
    <>
      {(timeLeftToAnswer ?? 0) > 0 && (
        <Form questionId={questionId} ownerTeamId={ownerTeamId ?? ""} />
      )}
    </>
  );
}

function Form({ ownerTeamId, questionId }: { ownerTeamId: string; questionId: string }) {
  const router = useRouter();

  async function sendAnswer(answer: string) {
    const response = await fetchWithBaseUrl(`/api/questions/answer/${ownerTeamId}/${questionId}`, {
      body: JSON.stringify({ answer }),
      method: "POST",
    });

    if (!response.ok) {
      throw Error("Error when answering");
    }
    router.refresh();
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const answer = event.currentTarget.answer.value;
        sendAnswer(answer);
      }}
    >
      <input type="text" name="answer" />
      <div className={styles.buttons}>
        <button>Answer</button>
        <button
          type="button"
          onClick={() => {
            sendAnswer("Hiders couldn't answer that");
          }}
        >
          Cannot Answer
        </button>
      </div>
    </form>
  );
}
