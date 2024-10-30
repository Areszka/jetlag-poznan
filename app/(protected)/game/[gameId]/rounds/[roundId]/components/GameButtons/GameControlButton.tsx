"use client";

import { useRoundContext } from "../../RoundProvider";
import OneMoreTurnButton from "./OneMoreTurnButton";
import StartRoundButton from "./StartRoundButton";
import StopRoundButton from "./StopRoundButton";
import useUserTeam from "@/app/hooks/use_user_team";

export default function GameControlButton() {
  const { round } = useRoundContext();
  const { userTeam } = useUserTeam();

  if (round.end_time) return <OneMoreTurnButton />;

  if (!round.start_time && userTeam.role === "HIDER") return <StartRoundButton />;

  if (round.start_time && !round.end_time && userTeam.role === "SEEKER") return <StopRoundButton />;

  return;
}
