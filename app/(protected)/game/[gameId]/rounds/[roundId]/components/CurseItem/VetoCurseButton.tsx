"use client";

import { useRouter } from "next/navigation";
import styles from "./TeamCurseItem.module.css";
import { fetchWithBaseUrl } from "@/app/helpers";
import { sendNotification } from "@/app/utils/actions";
import { useRoundContext } from "../../TeamProvider";

export default function VetoCurseButton({ curseId }: { curseId: string }) {
  const { userTeam, round } = useRoundContext();

  const ids: string[] = round.teams
    .filter((team) => team.teamId !== userTeam.teamId)
    .flatMap((team) => team.members.flatMap((member) => member.id));

  const router = useRouter();

  async function vetoCurse() {
    const response = await fetchWithBaseUrl(`/api/curses/${curseId}/veto`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    await sendNotification(
      `${userTeam.name} vetoed curse!`,
      "They cannot move or ask questions for 15 minutes",
      ids!
    );

    router.refresh();
  }

  return (
    <button className={styles.vetoCurseButton} onClick={vetoCurse}>
      Veto
    </button>
  );
}
