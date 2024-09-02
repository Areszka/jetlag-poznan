import { Game, Team, User } from "@prisma/client";
import { fetchWithBaseUrl } from "../../helpers";

type GameResponse = Game & {
  teams: Array<
    Team & {
      members: User[];
    }
  >;
};

export default async function Page({ params }: { params: { id: string } }) {
  const response = await fetchWithBaseUrl(`/api/games/${params.id}`);

  if (!response.ok) {
    return <p>Error</p>;
  }

  const data: GameResponse = await response.json();
  return (
    <>
      <h1>Game name: {data.name}</h1>
      <div>
        Teams:{" "}
        {data.teams.map((team) => {
          return (
            <p key={team.id}>
              {team.name} - {team.coins} - {team.role}
              Members:
              {team.members.map((member) => {
                return <p key={member.id}>{member.username}</p>;
              })}
            </p>
          );
        })}
      </div>
    </>
  );
}
