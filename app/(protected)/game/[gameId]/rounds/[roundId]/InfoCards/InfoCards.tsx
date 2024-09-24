"use client";
import useGameTime from "@/app/hooks/use-game-time";
import styles from "./InfoCards.module.css";
import { getTime, timeToMinutesAndSeconds } from "@/app/helpers";
import { useServerLoading } from "@/app/hooks/use-server-loading";
import { Role } from "@prisma/client";

export default function InfoCards({
  endTime,
  startTime,
  pendingQuestions,
  activeCurse,
  team,
  role,
  answerTimeLimit,
}: {
  endTime: Date | null;
  startTime: Date | null;
  pendingQuestions: number;
  activeCurse?: string;
  team: string;
  role: Role;
  answerTimeLimit: number;
}) {
  const time = useGameTime({ endTime, startTime });
  const isLoading = useServerLoading();

  return (
    <div className={styles.cardsWrapper}>
      <Card label="answer Time Limit">{timeToMinutesAndSeconds(answerTimeLimit)}</Card>
      <Card label="team" color="#35AF4F">
        {team}
      </Card>
      <Card label="role" color="#35AF4F">
        {role}
      </Card>
      <Card label="time">{isLoading ? "--:--:--" : getTime(time)}</Card>
      <Card label="Pending questions" color="#FB6A35">
        {pendingQuestions.toString()}
      </Card>
      {activeCurse && (
        <Card label="Active curse" color="#fd1216">
          {activeCurse}
        </Card>
      )}
    </div>
  );
}

function Card({ label, children, color }: { label: string; children: string; color?: string }) {
  return (
    <div className={styles.cardWrapper}>
      <p className={styles.value} style={{ color: color }}>
        {children}
      </p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
