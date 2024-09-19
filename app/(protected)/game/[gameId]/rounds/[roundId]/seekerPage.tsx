import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import { TeamRoundQuestion } from "@prisma/client";
import React from "react";
import QuestionItem from "./QuestionItem/QuestionItem";
import styles from "./round.module.css";

export default function SeekerPage({
  response,
  userTeamId,
}: {
  response: GetRoundResponse;
  userTeamId: string;
}) {
  const questionsAskedByUserTeam: TeamRoundQuestion[] = response.round.questions.filter(
    (question) => question.teamId === userTeamId
  );

  return (
    <>
      <div>
        {response.round.curses.map((curse) => {
          return <p key={curse.curseId}>{curse.curse.name}</p>;
        })}
      </div>
      <div className={styles.questionsWrapper}>
        {response.round.game.game_questions.map((q) => {
          const questionDetails = questionsAskedByUserTeam.find((ques) => ques.questionId === q.id);

          return (
            <QuestionItem
              key={q.id}
              askedAt={questionDetails ? questionDetails.created_at : null}
              answer={questionDetails ? questionDetails.answer : null}
              cost={q.cost}
              details={q.details}
              question={q.content}
              userRole="SEEKER"
              questionId={q.id}
              timeLimitToAnswerQuestion={response.round.game.answer_time_limit}
            />
          );
        })}
      </div>
    </>
  );
}
