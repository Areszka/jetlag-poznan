"use client";

import { getTime, timeToMinutesAndSeconds } from "@/app/helpers";
import InfoCard from "./InfoCard";
import { useServerLoading } from "@/app/hooks/use-server-loading";
import useGameTime from "@/app/hooks/use-game-time";
import Link from "next/link";
import { useRoundContext } from "../../RoundProvider";
import { useGameContext } from "../../GameProvider";
import useUserTeam from "@/app/hooks/use_user_team";

export function AnswerTimeLimitCard() {
  const { game } = useGameContext();

  return (
    <InfoCard label="answer Time Limit">{timeToMinutesAndSeconds(game.answer_time_limit)}</InfoCard>
  );
}

export function RoleCard() {
  const { userTeam } = useUserTeam();

  return (
    <InfoCard label="your role" color="#35AF4F">
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
      href="https://www.google.com/maps/d/u/0/edit?mid=1nPSputglR8wKnNoCp9CQVtynoM7IsZw&ll=52.399101289084555%2C16.919556011105684&z=13"
    >
      <InfoCard label="map">🗺️</InfoCard>
    </Link>
  );
}

export function DiceCostCard() {
  const { game } = useGameContext();
  return (
    <InfoCard label="dice cost" color="#e6d30b">
      {game.dice_cost.toString()}
    </InfoCard>
  );
}
