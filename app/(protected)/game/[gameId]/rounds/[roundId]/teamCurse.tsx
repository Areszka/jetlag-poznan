"use client";
import { Curse, TeamRoundCurse } from "@prisma/client";

import styles from "./round.module.css";
import { fetchWithBaseUrl } from "@/app/helpers";
import { useRouter } from "next/navigation";

export default function TeamCurse({
  curse,
  roundCurse,
}: {
  curse: Curse;
  roundCurse: TeamRoundCurse;
}) {
  const curseIsActive = !roundCurse.lifted_at && !roundCurse.vetoed_at;
  const router = useRouter();

  async function liftCurse() {
    const response = await fetchWithBaseUrl(`/api/curses/${curse.id}/${roundCurse.teamId}/lift`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    router.refresh();
  }
  return (
    <div className={styles.teamCurseWrapper}>
      <p>{curse.id}</p>
      <div className={styles.nameWrapper}>
        <p className={styles.name}>{curse.name}</p>
        {!curseIsActive && <p>{roundCurse.lifted_at ? "✅" : "❌"}</p>}
      </div>
      {curseIsActive && (
        <>
          <p className={styles.effect}>{curse.effect}</p>
          <button className={styles.liftCurseButton} onClick={liftCurse}>
            Mark as DONE!
          </button>
        </>
      )}
    </div>
  );
}
