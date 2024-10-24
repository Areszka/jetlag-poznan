import {
  ActiveCurseCard,
  AnswerTimeLimitCard,
  DiceCostCard,
  MapCard,
  PendingQuestionsCard,
  RoleCard,
  TimeCard,
} from "./CustomInfoCards";
import styles from "./InfoCards.module.css";

export function SeekerInfoCards() {
  return (
    <InfoCards>
      <RoleCard />
      <AnswerTimeLimitCard />
      <DiceCostCard />
      <PendingQuestionsCard />
      <MapCard />
      <TimeCard />
      <ActiveCurseCard />
    </InfoCards>
  );
}

export function HiderInfoCards() {
  return (
    <InfoCards>
      <RoleCard />
      <AnswerTimeLimitCard />
      <DiceCostCard />
      <PendingQuestionsCard />
      <MapCard />
      <TimeCard />
    </InfoCards>
  );
}

function InfoCards({ children }: { children: JSX.Element[] }) {
  return <div className={styles.cardsWrapper}>{children}</div>;
}
