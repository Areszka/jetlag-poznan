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
          {curseIsActive && (
            <>
              <Text type="description">{curse.effect}</Text>
              {userIsHider && !round.end_time && (
                <LiftCurseButton curseId={curse.id} teamId={curse.teamId} />
              )}
              {isTarget && !round.end_time && <VetoCurseButton curseId={curse.id} />}
            </>
          )}
        </div>
        {curse.vetoed_at && !round.end_time && <VetoText vetoedAt={curse.vetoed_at}></VetoText>}
      </>
    </TeamCurseWrapper>
  );
}
