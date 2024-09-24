import { serverFetch } from "@/app/server-fetch";
import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import { validateSession } from "@/app/api/auth";
import HiderPage from "./hiderPage";
import SeekerPage from "./seekerPage";
import OneMoreTurnButton from "./GameButtons/OneMoreTurnButton";
import StopRoundButton from "./GameButtons/StopRoundButton";
import StartRoundButton from "./GameButtons/StartRoundButton";
import styles from "./round.module.css";
import InfoCards from "./InfoCards/InfoCards";

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

  let activeCurses: string[] = [];
  if (userRole === "SEEKER") {
    round.curses.forEach((curse) => {
      if (curse.teamId === userTeam.teamId && !curse.lifted_at && !curse.vetoed_at) {
        activeCurses.push(curse.curse.name);
      }
    });
  }

  const activeCurse = (() => {
    if (userRole === "SEEKER" && activeCurses.length > 0) return activeCurses[0];
    if (userRole === "SEEKER") return "None!";
    return undefined;
  })();

  let pendingQuestions = 0;

  if (userRole === "HIDER") {
    round.questions.forEach((question) => {
      if (!question.answer) {
        pendingQuestions++;
      }
    });
  } else {
    round.questions.forEach((question) => {
      if (!question.answer && question.teamId === userTeam.teamId) {
        pendingQuestions++;
      }
    });
  }

  return (
    <>
      <InfoCards
        role={userRole}
        team={userTeam.team.name}
        endTime={round.end_time}
        startTime={round.start_time}
        activeCurse={activeCurse}
        pendingQuestions={pendingQuestions}
        answerTimeLimit={round.game.answer_time_limit}
      ></InfoCards>

      {round.end_time && <OneMoreTurnButton />}
      {!round.start_time && userRole === "HIDER" && <StartRoundButton />}
      {round.start_time && !round.end_time && userRole === "SEEKER" && (
        <StopRoundButton startTime={round.start_time} jailPeriod={round.game.jail_duration} />
      )}
      {userRole === "HIDER" && <HiderPage response={data} />}
      {userRole === "SEEKER" && <SeekerPage response={data} userTeamId={userTeam.teamId} />}
    </>
  );
}
