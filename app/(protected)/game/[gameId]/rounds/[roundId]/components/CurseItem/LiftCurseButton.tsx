"use client";

import { useParams } from "next/navigation";
import styles from "./TeamCurseItem.module.css";
import { fetcherPost } from "@/app/helpers";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";
import { useSWRConfig } from "swr";

export default function LiftCurseButton({ curseId, teamId }: { curseId: string; teamId: string }) {
  const { mutate } = useSWRConfig();
  const params = useParams();

  const { trigger, isMutating } = useSWRMutation(
    `/api/curses/${curseId}/${teamId}/lift`,
    fetcherPost
  );

  function liftCurse() {
    trigger().then(() => mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/curses`));
  }

  return (
    <button className={styles.liftCurseButton} onClick={liftCurse} disabled={isMutating}>
      {isMutating ? <Spinner /> : "Mark as DONE!"}
    </button>
  );
}
