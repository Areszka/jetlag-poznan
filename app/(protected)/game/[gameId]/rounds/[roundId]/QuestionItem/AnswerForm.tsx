"use client";

import { fetchWithBaseUrl } from "@/app/helpers";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./QuestionItem.module.css";
import useCountdown from "@/app/hooks/use-countdown";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";

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
  const { trigger, isMutating } = useSWRMutation<any, Error, any, string>(
    `/api/questions/answer/${ownerTeamId}/${questionId}`,
    fetcher
  );

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const answer = event.currentTarget.answer.value;
        trigger(answer).then(() => router.refresh());
      }}
    >
      <input type="text" name="answer" />
      <div className={styles.buttons}>
        <button disabled={isMutating}>Answer</button>
        <button
          type="button"
          onClick={() => {
            trigger("Hiders couldn't answer that").then(() => router.refresh());
          }}
          disabled={isMutating}
        >
          Cannot Answer
        </button>
      </div>
      {isMutating && <Spinner />}
    </form>
  );
}

async function fetcher(url: string, { arg }: { arg: string }) {
  return fetch(url, {
    body: JSON.stringify({ answer: arg }),
    method: "POST",
  }).then(async (res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(res.statusText);
    }
  });
}
