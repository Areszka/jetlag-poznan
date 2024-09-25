import {
  ActiveCurseCard,
  AnswerTimeLimitCard,
  PendingQuestionsCard,
  RoleCard,
  TeamNameCard,
  TimeCard,
} from "./CustomInfoCards";
import styles from "./InfoCards.module.css";

export function SeekerInfoCards() {
  return (
    <InfoCards>
      <TimeCard />
      <RoleCard />
      <TeamNameCard />
      <PendingQuestionsCard />
      <ActiveCurseCard />
    </InfoCards>
  );
}

export function HiderInfoCards() {
  return (
    <InfoCards>
      <TimeCard />
      <RoleCard />
      <AnswerTimeLimitCard />
      <TeamNameCard />
      <PendingQuestionsCard />
    </InfoCards>
  );
}

function InfoCards({ children }: { children: JSX.Element[] }) {
  return <div className={styles.cardsWrapper}>{children}</div>;
}
