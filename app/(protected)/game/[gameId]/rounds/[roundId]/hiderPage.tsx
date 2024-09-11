import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import styles from "./round.module.css";
import Timer from "./timer";
import Tag from "@/app/ui/components/tag/tag";
import ThrowCurse from "@/app/ui/throw-curse/throw-curse";
import CursesCard from "./cursesCard";
import { Curse, Team, TeamRoundCurse } from "@prisma/client";
import TeamCurse from "./teamCurse";

export default async function HiderPage({ response }: { response: GetRoundResponse }) {
  const round = response.round;

  return (
    <>
      <h1>Hider Page</h1>
      <Timer initialStartTime={round.start_time} initialEndTime={round.end_time} />
      <div className={styles.teamsWrapper}>
        {round.teams.map(({ team, coins, role }) => {
          if (role === "HIDER") return;
          return (
            <div key={team.id} className={styles.teamWrapper}>
              <div className={styles.teamHeader}>
                {team.name} <Tag>{coins.toString()}</Tag>
              </div>
              <ThrowCurse teamId={team.id} coins={coins} />
              <div>
                {round.curses.map((curse) => {
                  if (curse.teamId === team.id) {
                    return <TeamCurse key={team.id} roundCurse={curse} curse={curse.curse} />;
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
      <CursesCard />
    </>
  );
}
