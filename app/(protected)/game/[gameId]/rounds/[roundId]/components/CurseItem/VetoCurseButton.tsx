"use client";

import { useParams } from "next/navigation";
import styles from "./TeamCurseItem.module.css";
import { fetcherPost } from "@/app/helpers";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";

export default function VetoCurseButton({ curseId }: { curseId: string }) {
  const { mutate } = useSWRConfig();
  const params = useParams();

  const { trigger, isMutating } = useSWRMutation(`/api/curses/${curseId}/veto`, fetcherPost);

  async function vetoCurse() {
    trigger().then(() => mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/curses`));
  }

  return (
    <button className={styles.vetoCurseButton} onClick={vetoCurse} disabled={isMutating}>
      {isMutating ? <Spinner /> : "Veto"}
    </button>
  );
}
