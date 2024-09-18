import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import { TeamRoundQuestion } from "@prisma/client";
import React from "react";
import QuestionItem from "./QuestionItem/QuestionItem";
import Card from "@/app/ui/components/card/card";
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
      <Card title="Questions">
        {response.round.game.game_questions.map((q) => {
          const questionDetails = questionsAskedByUserTeam.find((ques) => ques.questionId === q.id);

          return (
            <QuestionItem
              key={q.id}
              question={q}
              askedAt={questionDetails ? questionDetails.created_at : undefined}
              questionDetails={questionDetails ?? undefined}
            />
          );
        })}
        `
      </Card>
    </>
  );
}
