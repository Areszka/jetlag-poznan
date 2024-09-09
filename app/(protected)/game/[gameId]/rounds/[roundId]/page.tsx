import { fetchWithBaseUrl } from "../../../../../helpers";
import { GetGameResponse } from "@/app/api/games/[gameId]/route";
import { headers } from "next/headers";
import Timer from "./timer";

export default async function Page({ params }: { params: { gameId: string; roundId: string } }) {
  const headersList = headers();
  const cookieHeader = headersList.get("cookie") || "";

  const response = await fetchWithBaseUrl(`/api/games/${params.gameId}`, {
    headers: {
      Cookie: cookieHeader, // Forward cookies here
    },
  });

  if (!response.ok) {
    return <p>Error</p>;
  }

  const data: GetGameResponse = await response.json();

  return (
    <>
      <h1>Game name: {data.game.name}</h1>
      <Timer
        params={params}
        initialStartTime={data.game.rounds.find((round) => round.id === params.roundId)?.start_time}
        initialEndTime={data.game.rounds.find((round) => round.id === params.roundId)?.end_time}
      />
      <div>
        Rounds:
        {data.game.rounds.map((round, index) => {
          const startTime = round.start_time ? new Date(round.start_time) : undefined;
          const endTime = round.end_time ? new Date(round.end_time) : undefined;
          return (
            <div key={round.id}>
              <p>
                Round {index + 1}
                {startTime && <span>{startTime.toLocaleString()}</span>}
                {endTime && <span> - {endTime.toLocaleString()}</span>}
              </p>
              <div>
                Teams:
                {round.teams.map((team) => {
                  return (
                    <div key={team.team.id}>
                      {team.team.name} - {team.team.coins} - {team.role}
                      <ul>
                        {team.team.members.map((member) => {
                          return <li key={member.id}>{member.username}</li>;
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {data.game.questions.map((q) => (
          <p key={q.id}>{q.content}</p>
        ))}
      </div>
    </>
  );
}
