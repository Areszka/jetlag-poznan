"use client";

import { useRouter } from "next/navigation";
import styles from "./TeamCurseItem.module.css";
import { fetcherPost } from "@/app/helpers";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";

export default function LiftCurseButton({ curseId, teamId }: { curseId: string; teamId: string }) {
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    `/api/curses/${curseId}/${teamId}/lift`,
    fetcherPost
  );

  function liftCurse() {
    trigger().then(() => router.refresh());
  }

  return (
    <button className={styles.liftCurseButton} onClick={liftCurse} disabled={isMutating}>
      {isMutating ? <Spinner /> : "Mark as DONE!"}
    </button>
  );
}
