"use client";

import styles from "./TeamsSection.module.css";
import Tag from "@/app/ui/components/tag/tag";
import ThrowCurse from "@/app/ui/throw-curse/throw-curse";
import Curses from "../../curses/Curses";
import { useRoundContext } from "../../RoundProvider";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/app/helpers";
import { GetTeamResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/teams/[teamId]/route";

export default function TeamsSection() {
  const { round } = useRoundContext();

  return (
    <div className={styles.teamsWrapper}>
      {round.teams.map((team) => {
        if (team.role === "HIDER") return;

        return <TeamCard key={team.id} teamId={team.id}></TeamCard>;
      })}
    </div>
  );
}

function TeamCard({ teamId }: { teamId: string }) {
  const params: { gameId: string; roundId: string } = useParams();
  const { data, isLoading, error } = useSWR<GetTeamResponse, any, any, any>(
    `/api/games/${params.gameId}/rounds/${params.roundId}/teams/${teamId}`,
    fetcher,
    { refreshInterval: 3000 }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p> Error!</p>;
  }

  if (!data) {
    return <p>No Team Card Data!</p>;
  }

  const team = data.team;

  return (
    <div className={styles.teamWrapper}>
      <div className={styles.teamHeader}>
        {team.name} <Tag>{team.coins.toString()}</Tag>
      </div>
      <ThrowCurse teamId={team.id} coins={team.coins} />
      <Curses teamId={team.teamId}></Curses>
    </div>
  );
}
