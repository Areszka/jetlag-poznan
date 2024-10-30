"use client";

import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "../../RoundProvider";
import { useGameContext } from "../../GameProvider";
import useUserTeam from "@/app/hooks/use_user_team";

export default function AskButton({ onClick }: { onClick: () => {} }) {
  const { userTeam } = useUserTeam();
  const { round } = useRoundContext();

  if (userTeam.role === "HIDER" || !round.start_time || round.end_time) {
    return;
  }

  return <Button onClick={onClick} />;
}

function Button({ onClick }: { onClick: () => {} }) {
  const { game } = useGameContext();
  const { round } = useRoundContext();

  const jailTimeLeft = useCountdown({
    period: game.jail_duration,
    startTime: round.start_time!,
  });
  return (
    <button onClick={onClick} disabled={(jailTimeLeft ?? 1) > 0}>
      Ask
    </button>
  );
}
