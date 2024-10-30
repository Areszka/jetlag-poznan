"use client";

import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "../../RoundProvider";
import { useGameContext } from "../../GameProvider";
import useUserTeam from "@/app/hooks/use_user_team";
import useSWRMutation from "swr/mutation";
import { fetcherPost } from "@/app/helpers";
import { useParams } from "next/navigation";
import { useSWRConfig } from "swr";
import Spinner from "@/app/ui/components/spinner/spinner";

export default function AskButton({ questionId }: { questionId: string }) {
  const { userTeam } = useUserTeam();
  const { round } = useRoundContext();

  if (userTeam.role === "HIDER" || !round.start_time || round.end_time) {
    return;
  }

  return <Button questionId={questionId} />;
}

function Button({ questionId }: { questionId: string }) {
  const { game } = useGameContext();
  const { round } = useRoundContext();
  const params = useParams();

  const { trigger, isMutating } = useSWRMutation(`/api/questions/ask/${questionId}`, fetcherPost);
  const { mutate } = useSWRConfig();

  const jailTimeLeft = useCountdown({
    period: game.jail_duration,
    startTime: round.start_time!,
  });

  return (
    <button
      onClick={() => {
        trigger().then(() => {
          mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/questions`);
        });
      }}
      disabled={(jailTimeLeft ?? 1) > 0 || isMutating}
    >
      {isMutating ? <Spinner /> : "Ask"}
    </button>
  );
}
