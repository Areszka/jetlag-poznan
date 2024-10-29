import { TeamRoundCurse } from "@prisma/client";
import styles from "./TeamCurseItem.module.css";
import { Text } from "@/app/ui/components/text/text";
import LiftCurseButton from "./LiftCurseButton";
import VetoCurseButton from "./VetoCurseButton";
import VetoText from "./VetoText";
import TeamCurseWrapper from "./TeamCurseWrapper";
import { useRoundContext } from "../../TeamProvider";

export default function TeamCurseItem({ roundCurse }: { roundCurse: TeamRoundCurse }) {
  const { userTeam, round } = useRoundContext();

  const curse = round.game.game_curses.find((c) => c.curseId === roundCurse.curseId);

  if (!curse) {
    throw new Error(`Curse ${roundCurse.curseId} was not found in the game`);
  }

  const curseIsActive = !roundCurse.lifted_at && !roundCurse.vetoed_at;

  const userIsHider = userTeam.role === "HIDER";

  const isTarget = roundCurse.teamId === userTeam.teamId;

  const targetTeamName = round.teams.find((team) => team.teamId === roundCurse.teamId)?.name;

  return (
    <TeamCurseWrapper curseIsActive={curseIsActive} vetoedAt={roundCurse.vetoed_at}>
      <>
        <div>
          {targetTeamName && !userIsHider && (
            <p className={styles.team} style={{ color: `${isTarget ? "red" : undefined}` }}>
              {isTarget ? "You!" : targetTeamName}
            </p>
          )}
          <div className={styles.nameWrapper}>
            <Text type="title">{curse.name}</Text>
            {!curseIsActive && <p>{roundCurse.lifted_at ? "✅" : "❌"}</p>}
          </div>
          {curseIsActive && (
            <>
              <Text type="description">{curse.effect}</Text>
              {userIsHider && !round.end_time && (
                <LiftCurseButton curseId={roundCurse.curseId} teamId={roundCurse.teamId} />
              )}
              {isTarget && !round.end_time && <VetoCurseButton curseId={roundCurse.curseId} />}
            </>
          )}
        </div>
        {roundCurse.vetoed_at && !round.end_time && (
          <VetoText vetoedAt={roundCurse.vetoed_at}></VetoText>
        )}
      </>
    </TeamCurseWrapper>
  );
}
