import { AnswerTimeLimitCard, DiceCostCard, MapCard, RoleCard, TimeCard } from "./CustomInfoCards";
import styles from "./InfoCards.module.css";

export default function InfoCards() {
  return (
    <div className={styles.cardsWrapper}>
      <RoleCard />
      <AnswerTimeLimitCard />
      <DiceCostCard />
      <MapCard />
      <TimeCard />
    </div>
  );
}
