"use client";

import { formatTime } from "@/app/helpers";
import InfoCard from "./InfoCard";
import Link from "next/link";
import { useGameContext } from "../GameProvider";
import useUserTeam from "@/app/hooks/use_user_team";

export function AnswerTimeLimitCard() {
  const { game } = useGameContext();

  return <InfoCard label="answer Time Limit">{formatTime(game.answer_time_limit)}</InfoCard>;
}

export function JailPeriodCard() {
  const { game } = useGameContext();

  return (
    <InfoCard label="jail period" color="#d33333">
      {formatTime(game.jail_duration)}
    </InfoCard>
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

  if (!game.dice_cost) {
    return null; // If dice cost is not set, do not render the card
  }

  return (
    <InfoCard label="dice cost" color="#e6d30b">
      {game.dice_cost.toString()}
    </InfoCard>
  );
}
