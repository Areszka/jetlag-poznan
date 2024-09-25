"use client";

import { Question, TeamRoundQuestion } from "@prisma/client";
import { useRoundContext } from "./TeamProvider";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import QuestionItem from "./QuestionItem/QuestionItem";

export default function Questions() {
  const { round, userTeam } = useRoundContext();

  const questions: { question: Question; questionDetails: TeamRoundQuestion | undefined }[] =
    (() => {
      if (userTeam.role === "SEEKER") {
        return [
          ...round.game.game_questions.map((gameQuestion) => {
            return {
              question: gameQuestion,
              questionDetails: round.questions.find(
                (question) =>
                  question.teamId === userTeam.teamId && question.questionId === gameQuestion.id
              ),
            };
          }),
        ];
      }

      return [
        ...round.questions.map((questionDetails) => {
          return {
            question: round.game.game_questions.find(
              (gameQuestion) => gameQuestion.id === questionDetails.questionId
            )!,
            questionDetails,
          };
        }),
      ];
    })();

  return (
    <FlexWithGap>
      {questions.map(({ question, questionDetails }) => {
        return (
          <QuestionItem key={question.id} question={question} teamQuestion={questionDetails} />
        );
      })}
    </FlexWithGap>
  );
}
