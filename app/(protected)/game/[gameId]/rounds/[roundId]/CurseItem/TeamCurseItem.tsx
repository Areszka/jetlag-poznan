import { Curse, TeamRoundCurse } from "@prisma/client";
import styles from "./TeamCurseItem.module.css";
import { Text } from "@/app/ui/components/text/text";
import LiftCurseButton from "./LiftCurseButton";
import VetoCurseButton from "./VetoCurseButton";
import VetoText from "./VetoText";
import TeamCurseWrapper from "./TeamCurseWrapper";
import { useRoundContext } from "../TeamProvider";

export default function TeamCurseItem({
  curse,
  roundCurse,
}: {
  curse: Curse;
  roundCurse: TeamRoundCurse;
}) {
  const { userTeam, round } = useRoundContext();

  const curseIsActive = !roundCurse.lifted_at && !roundCurse.vetoed_at;

  const isHider = userTeam.role === "HIDER";

  const isTarget = roundCurse.teamId === userTeam.teamId;

  const targetTeamName =
    !isTarget && !isHider
      ? round.teams.find((team) => team.teamId === roundCurse.teamId)?.name
      : undefined;

  return (
    <TeamCurseWrapper curseIsActive={curseIsActive} vetoedAt={roundCurse.vetoed_at}>
      <>
        <div>
          <div className={styles.nameWrapper}>
            <Text
              type="title"
              tags={targetTeamName ? [{ children: targetTeamName, hue: 220 }] : undefined}
            >
              {curse.name}
            </Text>
            {!curseIsActive && <p>{roundCurse.lifted_at ? "✅" : "❌"}</p>}
          </div>
          {curseIsActive && (
            <>
              <Text type="description">{curse.effect}</Text>
              {isHider && <LiftCurseButton curseId={curse.id} teamId={roundCurse.teamId} />}
              {curseIsActive && !isHider && !targetTeamName && (
                <VetoCurseButton curseId={curse.id} />
              )}
            </>
          )}
        </div>
        {roundCurse.vetoed_at && <VetoText vetoedAt={roundCurse.vetoed_at}></VetoText>}
      </>
    </TeamCurseWrapper>
  );
}
