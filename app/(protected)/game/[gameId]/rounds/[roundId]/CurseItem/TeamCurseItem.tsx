import { Curse, Role, TeamRoundCurse } from "@prisma/client";
import styles from "./TeamCurseItem.module.css";
import { Text } from "@/app/ui/components/text/text";
import LiftCurseButton from "./LiftCurseButton";
import VetoCurseButton from "./VetoCurseButton";
import VetoText from "./VetoText";
import TeamCursesWrapper from "./TeamCursesWrapper";

export function CursesWrapper({ children }: { children: JSX.Element }) {
  return <div className={styles.cursesWrapper}>{children}</div>;
}

export default function TeamCurseItem({
  userRole,
  curse,
  roundCurse,
  targetTeamName,
}: {
  curse: Curse;
  roundCurse: TeamRoundCurse;
  userRole: Role;
  targetTeamName?: string;
}) {
  console.log("TeamCurseItem RENDERED");
  const curseIsActive = !roundCurse.lifted_at && !roundCurse.vetoed_at;

  const isHider = userRole === "HIDER";

  return (
    <TeamCursesWrapper curseIsActive={curseIsActive} vetoedAt={roundCurse.vetoed_at}>
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
    </TeamCursesWrapper>
  );
}
