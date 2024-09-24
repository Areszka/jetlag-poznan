"use client";

import { useRouter } from "next/navigation";
import styles from "./TeamCurseItem.module.css";
import { fetchWithBaseUrl } from "@/app/helpers";

export default function VetoCurseButton({ curseId }: { curseId: string }) {
  const router = useRouter();

  async function vetoCurse() {
    const response = await fetchWithBaseUrl(`/api/curses/${curseId}/veto`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    router.refresh();
  }

  return (
    <button className={styles.vetoCurseButton} onClick={vetoCurse}>
      Veto
    </button>
  );
}
