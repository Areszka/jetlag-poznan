"use client";

import { FlatTeamRound } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import { useRoundContext } from "../TeamProvider";
import styles from "./TeamsSection.module.css";
import Tag from "@/app/ui/components/tag/tag";
import ThrowCurse from "@/app/ui/throw-curse/throw-curse";
import Curses from "../Curses";

export default function TeamsSection() {
  const { round } = useRoundContext();

  return (
    <div className={styles.teamsWrapper}>
      {round.teams.map((team) => {
        if (team.role === "HIDER") return;

        return <TeamCard key={team.teamId} team={team}></TeamCard>;
      })}
    </div>
  );
}

function TeamCard({ team }: { team: FlatTeamRound }) {
  return (
    <div className={styles.teamWrapper}>
      <div className={styles.teamHeader}>
        {team.name} <Tag>{team.coins.toString()}</Tag>
      </div>
      <ThrowCurse teamId={team.teamId} />
      <Curses teamId={team.teamId}></Curses>
    </div>
  );
}
