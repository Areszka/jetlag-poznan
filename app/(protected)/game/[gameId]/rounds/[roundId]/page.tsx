import { serverFetch } from "@/app/server-fetch";
import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import { validateSession } from "@/app/api/auth";
import HiderPage from "./hiderPage";
import SeekerPage from "./seekerPage";
import OneMoreTurnButton from "./GameButtons/OneMoreTurnButton";
import StopRoundButton from "./GameButtons/StopRoundButton";
import StartRoundButton from "./GameButtons/StartRoundButton";
import Time from "./Time/Time";
import { getTime } from "@/app/helpers";
import styles from "./round.module.css";

export default async function Page({ params }: { params: { gameId: string; roundId: string } }) {
  const userId = await validateSession();

  const response = await serverFetch(`/api/games/${params.gameId}/rounds/${params.roundId}`);

  if (!response.ok) {
    return <p>Error</p>;
  }

  const data: GetRoundResponse = await response.json();
  const round = data.round;

  const userTeam = round.teams.find(({ team }) => team.members.some(({ id }) => id === userId));

  if (!userTeam) {
    throw new Error("No Team found");
  }

  const userRole = userTeam.role;

  return (
    <div className={styles.pageWrapper}>
      {userRole} - {userTeam.team.name}
      <br />
      jailTime - {getTime(round.game.jail_duration)}
      <br />
      anser limit - {getTime(round.game.answer_time_limit)}
      <br />
      coins per dice - {round.game.dice_cost}
      <br />
      <Time startTime={round.start_time} endTime={round.end_time} />
      {round.end_time && <OneMoreTurnButton />}
      {!round.start_time && userRole === "HIDER" && <StartRoundButton />}
      {round.start_time && !round.end_time && userRole === "SEEKER" && (
        <StopRoundButton startTime={round.start_time} jailPeriod={round.game.jail_duration} />
      )}
      {userRole === "HIDER" && <HiderPage response={data} />}
      {userRole === "SEEKER" && <SeekerPage response={data} userTeamId={userTeam.teamId} />}
    </div>
  );
}
