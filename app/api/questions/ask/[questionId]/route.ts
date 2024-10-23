import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Question, TeamRoundQuestion } from "@prisma/client";
import { sendNotification } from "@/app/(protected)/actions";

export type AskQuestionResponse = {
  question: TeamRoundQuestion & { question: Question };
};
export async function POST(_request: Request, { params }: { params: { questionId: string } }) {
  const userId = await validateSession();

  // Throw if the user is not in the target team or not a seeker
  const lastRound = await db.teamRound.findFirstOrThrow({
    where: {
      role: "SEEKER",
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      round: {
        end_time: null,
      },
    },
    include: {
      team: {
        include: {
          members: true,
        },
      },
      round: {
        include: {
          game: true,
          teams: {
            include: {
              team: {
                include: {
                  members: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const question = await db.teamRoundQuestion.create({
    data: {
      teamId: lastRound.teamId,
      roundId: lastRound.roundId,
      questionId: params.questionId,
    },
    include: {
      question: true,
    },
  });

  if (question) {
    setTimeout(async () => {
      const ques = await db.teamRoundQuestion.findFirst({
        where: {
          questionId: params.questionId,
          teamId: lastRound.teamId,
          roundId: lastRound.roundId,
        },
      });

      if (!ques?.answer) {
        db.teamRoundQuestion
          .update({
            where: {
              teamId_questionId_roundId: {
                questionId: params.questionId,
                teamId: lastRound.teamId,
                roundId: lastRound.roundId,
              },
            },
            data: {
              answered_at: new Date(),
              answer: "Hiders ran out of time to answer",
            },
            include: {
              question: true,
            },
          })
          .then(async () => {
            await sendNotification(
              `New answer`,
              "Hiders ran out of time to answer",
              lastRound.team.members.map((member) => member.id)
            );

            const hidersIds: string[] = lastRound.round.teams
              .find((team) => team.role === "HIDER")
              ?.team.members.map((m) => m.id)!;
            await sendNotification(
              `You ran out of time!`,
              `A default answer has been sent for the pending question from ${lastRound.team.name}`,
              hidersIds
            );
          });
      }
    }, lastRound.round.game.answer_time_limit);
  }

  return NextResponse.json<AskQuestionResponse>({
    question,
  });
}
