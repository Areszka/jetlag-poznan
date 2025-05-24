import styles from "./TeamCurseItem.module.css";
import { Text } from "@/app/ui/components/text/text";
import LiftCurseButton from "./LiftCurseButton";
import VetoCurseButton from "./VetoCurseButton";
import VetoText from "./VetoText";
import TeamCurseWrapper from "./TeamCurseWrapper";
import { FlatCurse } from "@/app/api/games/[gameId]/rounds/[roundId]/curses/route";
import useUserTeam from "@/app/hooks/use_user_team";
import { useRoundContext } from "../RoundProvider";

export default function TeamCurseItem({ curse }: { curse: FlatCurse }) {
  const { userTeam } = useUserTeam();
  const { round } = useRoundContext();

  const curseIsActive = !curse.lifted_at && !curse.vetoed_at;

  const userIsHider = userTeam.role === "HIDER";

  const isTarget = curse.teamId === userTeam.id;

  const targetTeamName = round.teams.find((team) => team.id === curse.teamId)?.name;

  return (
    <TeamCurseWrapper curseIsActive={curseIsActive} vetoedAt={curse.vetoed_at}>
      <>
        <div>
          {targetTeamName && !userIsHider && (
            <p className={styles.team} style={{ color: `${isTarget ? "red" : undefined}` }}>
              {isTarget ? "You!" : targetTeamName}
            </p>
          )}
          <div className={styles.nameWrapper}>
            <Text type="title">{curse.name}</Text>
            {!curseIsActive && <p>{curse.lifted_at ? "✅" : "❌"}</p>}
          </div>
          <p className={styles.createdAt}>
            {new Date(curse.created_at).toLocaleTimeString([], {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          {curseIsActive && (
            <>
              <Text type="description">{curse.effect}</Text>
              {userIsHider && !round.end_time && (
                <LiftCurseButton
                  curseId={curse.id}
                  teamId={curse.teamId}
                  createdAt={curse.created_at}
                />
              )}
              {isTarget && !round.end_time && (
                <VetoCurseButton curseId={curse.id} createdAt={curse.created_at} />
              )}
            </>
          )}
        </div>
        {curse.vetoed_at && !round.end_time && <VetoText vetoedAt={curse.vetoed_at}></VetoText>}
      </>
    </TeamCurseWrapper>
  );
}
