import {
  AnswerTimeLimitCard,
  DiceCostCard,
  JailPeriodCard,
  MapCard,
  RoleCard,
} from "./CustomInfoCards";
import styles from "./InfoCards.module.css";

export default function InfoCards() {
  return (
    <div className={styles.cardsWrapper}>
      <RoleCard />
      <AnswerTimeLimitCard />
      <JailPeriodCard />
      <DiceCostCard />
      <MapCard />
    </div>
  );
}
