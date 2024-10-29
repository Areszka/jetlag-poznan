"use client";

import { Question, TeamRoundQuestion } from "@prisma/client";
import styles from "./QuestionItem.module.css";
import AskButton from "./AskButton";
import React from "react";
import TimeLeftToAnswer from "./TimeLeftToAnswer";
import AnswerForm from "./AnswerForm";
import Item from "@/app/ui/components/Item/Item";
import { Text } from "@/app/ui/components/text/text";
import { fetchWithBaseUrl } from "@/app/helpers";
import { sendNotification } from "@/app/utils/actions";
import { useRouter } from "next/navigation";
import { useRoundContext } from "../../TeamProvider";

export default function QuestionItem({
  teamQuestion,
  question,
}: {
  teamQuestion: TeamRoundQuestion | undefined;
  question: Question;
}) {
  const { round, userTeam } = useRoundContext();
  const hidersIds = round.teams
    .find((team) => team.role === "HIDER")
    ?.members.map((member) => member.id);
  const isAnswerPending = teamQuestion && teamQuestion.created_at && !teamQuestion.answer;

  const router = useRouter();

  return (
    <Item style={isAnswerPending ? "orange" : undefined}>
      <div className={`${styles.wrapper}`}>
        <div>
          {teamQuestion && <AskedBy teamId={teamQuestion.teamId} />}
          <Text type="title" tags={[{ children: question.cost.toString() }]}>
            {question.content}
          </Text>
          {question.details && <p className={styles.details}>{question.details}</p>}
          {teamQuestion && teamQuestion.answer && (
            <p className={styles.answer}>Answer: {teamQuestion.answer}</p>
          )}
          {isAnswerPending && !round.end_time && (
            <TimeLeftToAnswer askedAt={teamQuestion.created_at} />
          )}
          {isAnswerPending && userTeam.role === "HIDER" && !round.end_time && (
            <AnswerForm
              askedAt={teamQuestion.created_at}
              ownerTeamId={teamQuestion.teamId}
              questionId={teamQuestion.questionId}
              timeLimitToAnswerQuestion={round.game.answer_time_limit}
            />
          )}
        </div>
        {!teamQuestion && userTeam.role === "SEEKER" && round.start_time && !round.end_time && (
          <AskButton onClick={sendQuestion} />
        )}
      </div>
    </Item>
  );

  async function sendQuestion() {
    const response = await fetchWithBaseUrl(`/api/questions/ask/${question.id}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw Error("Error when asking question");
    }
    await sendNotification(`New question from ${userTeam.name}`, question.content, hidersIds!);

    router.refresh();
  }
}

function AskedBy({ teamId }: { teamId: string }) {
  const { round, userTeam } = useRoundContext();

  const team = round.teams.find((team) => team.teamId === teamId);

  if (userTeam.role === "SEEKER" || !team) {
    return;
  }

  return (
    <p className={styles.askedBy}>
      {`${team.name} - ${team.members.map((m) => m.username).join(", ")}`}
    </p>
  );
}
