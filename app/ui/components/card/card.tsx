import { ReactNode } from "react";
import styles from "./card.module.css";

export default function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.cardWrapper}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
