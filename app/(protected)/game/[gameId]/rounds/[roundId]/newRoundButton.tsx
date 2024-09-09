"use client";
import { PostRoundResponse } from "@/app/api/games/[gameId]/rounds/create/route";
import { fetchWithBaseUrl } from "@/app/helpers";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function NewRoundButton() {
  const params = useParams<{ gameId: string }>();
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        const response = await fetchWithBaseUrl(`/api/games/${params.gameId}/rounds/create`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Error when creating new round");
        } else {
          const data: PostRoundResponse = await response.json();
          router.push(`/game/${params.gameId}/rounds/${data.round.id}`);
        }
      }}
    >
      Ja chcę jeszcze raz!
    </button>
  );
}
