"use client";
import { Curse, TeamRoundCurse } from "@prisma/client";

import styles from "./round.module.css";

export default function TeamCurse({
  curse,
  roundCurse,
}: {
  curse: Curse;
  roundCurse: TeamRoundCurse;
}) {
  const curseIsActive = !roundCurse.lifted_at && !roundCurse.vetoed_at;

  function liftCurse() {
    //todo
  }
  return (
    <div className={styles.teamCurseWrapper}>
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
