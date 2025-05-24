"use client";

import { useParams } from "next/navigation";
import styles from "./TeamCurseItem.module.css";
import { fetcherPost } from "@/app/helpers";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";
import { useSWRConfig } from "swr";
import Center from "@/app/ui/components/Center/Center";

export default function LiftCurseButton({
  curseId,
  teamId,
  createdAt,
}: {
  curseId: string;
  teamId: string;
  createdAt: Date;
}) {
  const { mutate } = useSWRConfig();
  const params = useParams();

  const { trigger, isMutating } = useSWRMutation(
    `/api/curses/${curseId}/${createdAt}/${teamId}/lift`,
    fetcherPost
  );

  function liftCurse() {
    trigger().then(() => mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/curses`));
  }

  return (
    <button className={styles.liftCurseButton} onClick={liftCurse} disabled={isMutating}>
      <Center> {isMutating ? <Spinner /> : "Mark as DONE!"}</Center>
    </button>
  );
}
