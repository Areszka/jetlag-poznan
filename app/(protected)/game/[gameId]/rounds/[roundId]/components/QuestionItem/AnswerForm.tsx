"use client";

import { useParams } from "next/navigation";
import React from "react";
import styles from "./QuestionItem.module.css";
import useCountdown from "@/app/hooks/use-countdown";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";
import { sendNotification } from "@/app/utils/actions";
import { useGameContext } from "../GameProvider";
import { useRoundContext } from "../RoundProvider";
import { useSWRConfig } from "swr";
import { fetcherPost } from "@/app/helpers";
import { AnswerQuestionRequest } from "@/app/api/questions/answer/[teamId]/[questionId]/route";

export default function AnswerForm({
  askedAt,
  questionId,
  ownerTeamId,
}: {
  questionId: string;
  askedAt: Date;
  ownerTeamId?: string;
}) {
  const { game } = useGameContext();
  const { round } = useRoundContext();
  const timeLeftToAnswer = useCountdown({
    startTime: askedAt,
    period: game.answer_time_limit,
  });

  if (round.end_time) {
    return;
  }

  return (
    <>
      {(timeLeftToAnswer ?? 0) > 0 && (
        <Form questionId={questionId} ownerTeamId={ownerTeamId ?? ""} />
      )}
    </>
  );
}

function Form({ ownerTeamId, questionId }: { ownerTeamId: string; questionId: string }) {
  const { mutate } = useSWRConfig();
  const params = useParams();
  const { trigger, isMutating } = useSWRMutation<any, Error, any, AnswerQuestionRequest>(
    `/api/questions/answer/${ownerTeamId}/${questionId}`,
    fetcherPost
  );
  const { round } = useRoundContext();
  const ownerTeamMembersIds = round.teams
    .find((team) => team.id === ownerTeamId)
    ?.members.map((member) => member.id);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const answer: string = event.currentTarget.answer.value;
        trigger({ answer }).then(async () => {
          await sendNotification({
            title: `New answer`,
            message: answer,
            targetUsersIds: ownerTeamMembersIds!,
            url: `/game/${params.gameId}/rounds/${params.roundId}/questions`,
          });
          mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/questions`);
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
            trigger({ answer: "Hiders were unable to answer this question" }).then(async () => {
              await sendNotification({
                title: `New answer`,
                message: "Hiders were unable to answer this question",
                targetUsersIds: ownerTeamMembersIds!,
                url: `/game/${params.gameId}/rounds/${params.roundId}/questions`,
              });
              mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/questions`);
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
