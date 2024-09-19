"use client";

import { fetchWithBaseUrl } from "@/app/helpers";
import { useRouter } from "next/navigation";
import React from "react";
import { Role } from "@prisma/client";
import useTimeLeftToAnswer from "./use_time_left_to_answer";
import styles from "./QuestionItem.module.css";

export default function AnswerForm({
  askedAt,
  userRole,
  questionId,
  timeLimitToAnswerQuestion,
  ownerTeamId,
}: {
  questionId: string;
  askedAt: Date;
  userRole: Role;
  askedBy?: string;
  timeLimitToAnswerQuestion: number;
  ownerTeamId?: string;
}) {
  const timeLeftToAnswer = useTimeLeftToAnswer({ askedAt, timeLimitToAnswerQuestion });
  const router = useRouter();

  React.useEffect(() => {
    async function sendDefaultAnswer() {
      const response = await fetchWithBaseUrl(
        `/api/questions/answer/${ownerTeamId}/${questionId}`,
        {
          body: JSON.stringify({ answer: "Hiders didn't manage to answer before time ran out " }),
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

    if (
      askedAt &&
      nextTimeLeftToAnswer <= 1000 &&
      (timeLeftToAnswer ?? 0) <= 0 &&
      userRole === "HIDER"
    ) {
      sendDefaultAnswer();
    }
  }, [
    askedAt,
    timeLeftToAnswer,
    userRole,
    timeLimitToAnswerQuestion,
    ownerTeamId,
    questionId,
    router,
  ]);

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
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        const answer = event.currentTarget.answer.value;
        const response = await fetchWithBaseUrl(
          `/api/questions/answer/${ownerTeamId}/${questionId}`,
          {
            body: JSON.stringify({ answer }),
            method: "POST",
          }
        );

        if (!response.ok) {
          throw Error("Error when answering");
        }
        router.refresh();
      }}
    >
      <input type="text" name="answer" />
      <div>
        <button>Answer</button>
        <button>Cannot Answer</button>
      </div>
    </form>
  );
}
