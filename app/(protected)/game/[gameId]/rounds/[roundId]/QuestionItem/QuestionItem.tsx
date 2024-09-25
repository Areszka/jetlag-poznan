import { TagProps } from "@/app/ui/components/tag/tag";
import { Question, TeamRoundQuestion } from "@prisma/client";
import styles from "./QuestionItem.module.css";
import AskButton from "./AskButton";
import React from "react";
import TimeLeftToAnswer from "./TimeLeftToAnswer";
import AnswerForm from "./AnswerForm";
import Item from "@/app/ui/components/Item/Item";
import { Text } from "@/app/ui/components/text/text";
import { useRoundContext } from "../TeamProvider";

export default function QuestionItem({
  teamQuestion,
  question,
}: {
  teamQuestion: TeamRoundQuestion | undefined;
  question: Question;
}) {
  const { round, userTeam } = useRoundContext();

  const isAnswerPending = teamQuestion && teamQuestion.created_at && !teamQuestion.answer;

  function getTitleTags() {
    let titleTags: Array<TagProps> = [{ children: question.cost.toString() }];
    if (!teamQuestion) {
      return titleTags;
    }
    const askedBy = round.teams.find((team) => team.teamId === teamQuestion.teamId)?.name;

    if (askedBy) {
      titleTags.push({ children: askedBy, hue: 200 });
    }

    return titleTags;
  }

  return (
    <Item style={isAnswerPending ? "orange" : undefined}>
      <div className={`${styles.wrapper}`}>
        <div>
          <Text type="title" tags={getTitleTags()}>
            {question.content}
          </Text>
          {question.details && <p className={styles.details}>{question.details}</p>}
          {teamQuestion && teamQuestion.answer && (
            <p className={styles.answer}>Answer: {teamQuestion.answer}</p>
          )}
          {isAnswerPending && <TimeLeftToAnswer askedAt={teamQuestion.created_at} />}
          {isAnswerPending && userTeam.role === "HIDER" && (
            <AnswerForm
              askedAt={teamQuestion.created_at}
              ownerTeamId={teamQuestion.teamId}
              questionId={teamQuestion.questionId}
              timeLimitToAnswerQuestion={round.game.answer_time_limit}
            />
          )}
        </div>
        {!teamQuestion && userTeam.role === "SEEKER" && <AskButton questionId={question.id} />}
      </div>
    </Item>
  );
}
