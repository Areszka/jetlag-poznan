"use client";

import { useRouter } from "next/navigation";
import styles from "./TeamCurseItem.module.css";
import { fetchWithBaseUrl } from "@/app/helpers";

export default function LiftCurseButton({ curseId, teamId }: { curseId: string; teamId: string }) {
  const router = useRouter();

  async function liftCurse() {
    const response = await fetchWithBaseUrl(`/api/curses/${curseId}/${teamId}/lift`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    router.refresh();
  }

  return (
    <button className={styles.liftCurseButton} onClick={liftCurse}>
      Mark as DONE!
    </button>
  );
}
