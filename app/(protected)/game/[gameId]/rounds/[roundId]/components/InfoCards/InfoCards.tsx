import {
  AnswerTimeLimitCard,
  DiceCostCard,
  JailPeriodCard,
  MapCard,
  RoleCard,
} from "./CustomInfoCards";
import styles from "./InfoCards.module.css";
import InfoCard from "./InfoCard";

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

export function InfoCardsPlaceholder() {
  return (
    <div className={styles.cardsWrapper}>
      <InfoCard label="your role" color="#35AF4F" placeholder={true}>
        -----
      </InfoCard>
      <InfoCard label="answer Time Limit" placeholder={true}>
        --:--
      </InfoCard>
      <InfoCard label="jail period" color="#d33333" placeholder={true}>
        --:--
      </InfoCard>
      <InfoCard label="dice cost" color="#e6d30b" placeholder={true}>
        --
      </InfoCard>
      <MapCard />
    </div>
  );
}
