"use client";

import { useRoundContext } from "../TeamProvider";
import OneMoreTurnButton from "./OneMoreTurnButton";
import StartRoundButton from "./StartRoundButton";
import StopRoundButton from "./StopRoundButton";

export default function GameControlButton() {
  const { round, userTeam } = useRoundContext();

  if (round.end_time) return <OneMoreTurnButton />;

  if (!round.start_time && userTeam.role === "HIDER") return <StartRoundButton />;

  if (round.start_time && !round.end_time && userTeam.role === "SEEKER") return <StopRoundButton />;

  return;
}
