"use client";

import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "../../TeamProvider";

export default function AskButton({ onClick }: { onClick: () => {} }) {
  const { round } = useRoundContext();
  const jailTimeLeft = useCountdown({
    period: round.game.jail_duration,
    startTime: round.start_time!,
  });

  return (
    <button onClick={onClick} disabled={(jailTimeLeft ?? 1) > 0}>
      Ask
    </button>
  );
}
