import { db } from "../../db";
import { NextResponse } from "next/server";
import { Game, Round, Team, TeamRound, User } from "@prisma/client";
import { validateSession } from "@/app/api/auth";

export type GetGameResponse = {
  game: Game & {
    rounds: Array<
      Round & {
        teams: Array<
          TeamRound & {
            team: Team & { members: Array<Pick<User, "username" | "id">> };
          }
        >;
      }
    >;
  };
};
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const userId = await validateSession();
  const game = await db.game.findFirstOrThrow({
    where: {
      id: params.id,
      ownerId: userId,
    },
    include: {
      rounds: {
        include: {
          teams: {
            include: {
              team: {
                include: {
                  members: {
                    select: {
                      username: true,
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

  return NextResponse.json<GetGameResponse>({ game });
}

export type DeleteGamesResponse = { game: Game };
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await validateSession();
  const game = await db.game.delete({
    where: { id: params.id, ownerId: userId },
  });

  return NextResponse.json<DeleteGamesResponse>({ game });
}
