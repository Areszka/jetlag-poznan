"use client";

import { Question, TeamRoundQuestion } from "@prisma/client";
import styles from "./QuestionItem.module.css";
import AskButton from "./AskButton";
import React from "react";
import TimeLeftToAnswer from "./TimeLeftToAnswer";
import AnswerForm from "./AnswerForm";
import Item from "@/app/ui/components/Item/Item";
import { Text } from "@/app/ui/components/text/text";
import { useRoundContext } from "../TeamProvider";
import useCountdown from "@/app/hooks/use-countdown";

export default function QuestionItem({
  teamQuestion,
  question,
}: {
  teamQuestion: TeamRoundQuestion | undefined;
  question: Question;
}) {
  const { round, userTeam } = useRoundContext();
  const isAnswerPending = teamQuestion && teamQuestion.created_at && !teamQuestion.answer;
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
          <AskButtonWrapper questionId={question.id} />
        )}
      </div>
    </Item>
  );
}

function AskButtonWrapper({ questionId }: { questionId: string }) {
  const { round } = useRoundContext();
  const jailTimeLeft = useCountdown({
    period: round.game.jail_duration,
    startTime: round.start_time!,
  });

  return <AskButton questionId={questionId} disabled={(jailTimeLeft ?? 1) > 0} />;
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
