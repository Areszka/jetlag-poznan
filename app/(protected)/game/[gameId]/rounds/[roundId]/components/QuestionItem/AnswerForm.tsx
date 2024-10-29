"use client";

import { useRouter } from "next/navigation";
import React from "react";
import styles from "./QuestionItem.module.css";
import useCountdown from "@/app/hooks/use-countdown";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";
import { sendNotification } from "@/app/utils/actions";
import { useRoundContext } from "../../TeamProvider";

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
  const { round } = useRoundContext();
  const ownerTeamMembersIds = round.teams
    .find((team) => team.teamId === ownerTeamId)
    ?.members.map((member) => member.id);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const answer = event.currentTarget.answer.value;
        trigger(answer).then(async () => {
          await sendNotification(`New answer`, answer, ownerTeamMembersIds!);
          router.refresh();
        });
      }}
    >
      <input type="text" name="answer" required={true} minLength={1} />
      <div className={styles.buttons}>
        <button disabled={isMutating} type="submit">
          Answer
        </button>
        <button
          type="button"
          onClick={() => {
            trigger("Hiders were unable to answer this question").then(async () => {
              await sendNotification(
                `New answer 👀`,
                "Hiders were unable to answer this question",
                ownerTeamMembersIds!
              );
              router.refresh();
            });
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
