"use client";

import { useParams } from "next/navigation";
import styles from "./TeamCurseItem.module.css";
import { fetcherPost } from "@/app/helpers";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";
import Center from "@/app/ui/components/Center/Center";

export default function VetoCurseButton({
  curseId,
  createdAt,
}: {
  curseId: string;
  createdAt: Date;
}) {
  const { mutate } = useSWRConfig();
  const params = useParams();

  const { trigger, isMutating } = useSWRMutation(
    `/api/curses/${curseId}/${createdAt}/veto`,
    fetcherPost
  );

  async function vetoCurse() {
    trigger().then(() => mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/curses`));
  }

  return (
    <button className={styles.vetoCurseButton} onClick={vetoCurse} disabled={isMutating}>
      <Center>{isMutating ? <Spinner /> : "Veto"}</Center>
    </button>
  );
}
