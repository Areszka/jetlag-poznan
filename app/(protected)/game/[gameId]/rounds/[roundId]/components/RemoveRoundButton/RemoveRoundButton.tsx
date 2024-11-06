"use client";

import { fetcherDelete } from "@/app/helpers";
import Spinner from "@/app/ui/components/spinner/spinner";
import { useParams, useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import styles from "./RemoveRoundButton.module.css";

export default function RemoveRoundButton() {
  const params: { gameId: string; roundId: string } = useParams();
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    `/api/games/${params.gameId}/rounds/${params.roundId}`,
    fetcherDelete
  );

  async function removeRound() {
    trigger().then(() => router.push(`/`));
  }

  return (
    <button className={styles.button} disabled={isMutating} onClick={removeRound}>
      Remove this round {isMutating && <Spinner color="red" />}
    </button>
  );
}
