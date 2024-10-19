import {
  ActiveCurseCard,
  AnswerTimeLimitCard,
  DiceCostCard,
  MapCard,
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
      <AnswerTimeLimitCard />
      <TeamNameCard />
      <PendingQuestionsCard />
      <ActiveCurseCard />
      <DiceCostCard />
      <MapCard />
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
      <DiceCostCard />
      <MapCard />
    </InfoCards>
  );
}

function InfoCards({ children }: { children: JSX.Element[] }) {
  return <div className={styles.cardsWrapper}>{children}</div>;
}
