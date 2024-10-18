"use client";

import { getTime, timeToMinutesAndSeconds } from "@/app/helpers";
import { useRoundContext } from "../TeamProvider";
import InfoCard from "./InfoCard";
import { useServerLoading } from "@/app/hooks/use-server-loading";
import useGameTime from "@/app/hooks/use-game-time";
import Link from "next/link";

export function ActiveCurseCard() {
  const { round, userTeam } = useRoundContext();

  if (userTeam.role === "HIDER") return;

  const activeCursesIds = [
    ...round.curses
      .filter((curse) => curse.teamId === userTeam.teamId && !curse.lifted_at && !curse.vetoed_at)
      .map((curse) => curse.curseId),
  ];

  let activeCurse = undefined;

  if (activeCursesIds.length > 0) {
    activeCurse = round.game.game_curses.find(
      (gameCurse) => gameCurse.curseId === activeCursesIds[0]
    )?.name!;
  }

  return (
    <InfoCard label="Active curse" color="#fd1216">
      {activeCurse || "None!"}
    </InfoCard>
  );
}

export function AnswerTimeLimitCard() {
  const { round } = useRoundContext();

  return (
    <InfoCard label="answer Time Limit">
      {timeToMinutesAndSeconds(round.game.answer_time_limit)}
    </InfoCard>
  );
}

export function PendingQuestionsCard() {
  const { round, userTeam } = useRoundContext();

  let pendingQuestions = 0;

  if (userTeam.role === "HIDER") {
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
    <InfoCard label="Pending questions" color="#FB6A35">
      {pendingQuestions.toString()}
    </InfoCard>
  );
}

export function TeamNameCard() {
  const { userTeam } = useRoundContext();

  return (
    <InfoCard label="team" color="#35AF4F">
      {userTeam.name}
    </InfoCard>
  );
}

export function RoleCard() {
  const { userTeam } = useRoundContext();

  return (
    <InfoCard label="role" color="#35AF4F">
      {userTeam.role}
    </InfoCard>
  );
}

export function TimeCard() {
  const { round } = useRoundContext();
  const isLoading = useServerLoading();
  const time = useGameTime({ endTime: round.end_time, startTime: round.start_time });

  return <InfoCard label="time">{isLoading ? "--:--:--" : getTime(time)}</InfoCard>;
}

export function MapCard() {
  return (
    <Link
      target="_blank"
      href="https://www.google.com/maps/d/u/0/edit?mid=1UF7JVajasCXbH6uLcbGnUnYDvUTjpQg&ll=52.410191460656776%2C16.884149898367138&z=13"
    >
      <InfoCard label="map">🗺️</InfoCard>
    </Link>
  );
}

export function DiceCostCard() {
  const { round } = useRoundContext();
  return (
    <InfoCard label="dice cost" color="#e6d30b">
      {round.game.dice_cost.toString()}
    </InfoCard>
  );
}
