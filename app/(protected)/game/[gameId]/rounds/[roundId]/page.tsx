import { GetGameResponse } from "@/app/api/games/[gameId]/route";
import Timer from "./timer";
import { serverFetch } from "@/app/server-fetch";
import NewRoundButton from "./newRoundButton";

export default async function Page({ params }: { params: { gameId: string; roundId: string } }) {
  const response = await serverFetch(`/api/games/${params.gameId}`);

  if (!response.ok) {
    return <p>Error</p>;
  }

  const data: GetGameResponse = await response.json();

  const round = data.game.rounds.find((round) => round.id === params.roundId);

  return (
    <>
      <h1>Game name: {data.game.name}</h1>
      <Timer
        params={params}
        initialStartTime={round?.start_time}
        initialEndTime={round?.end_time}
      />

      <div>
        Rounds:
        {data.game.rounds.map((round, index) => {
          const startTime = round.start_time ? new Date(round.start_time) : undefined;
          const endTime = round.end_time ? new Date(round.end_time) : undefined;
          return (
            <div key={round.id} style={{ background: "red", margin: "10px" }}>
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
