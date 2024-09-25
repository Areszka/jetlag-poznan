"use client";

import { getTime, timeToMinutesAndSeconds } from "@/app/helpers";
import { useRoundContext } from "../TeamProvider";
import InfoCard from "./InfoCard";
import { useServerLoading } from "@/app/hooks/use-server-loading";
import useGameTime from "@/app/hooks/use-game-time";

export function ActiveCurseCard() {
  const { round, userTeam } = useRoundContext();

  if (userTeam.role === "HIDER") return;

  const activeCurses = [
    ...round.curses
      .filter((curse) => curse.teamId === userTeam.teamId && !curse.lifted_at && !curse.vetoed_at)
      .map((curse) => curse.curse.name),
  ];

  return (
    <InfoCard label="Active curse" color="#fd1216">
      {activeCurses.length > 0 ? activeCurses[0] : "None!"}
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
