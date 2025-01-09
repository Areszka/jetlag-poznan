import { redactedScript } from "@/app/fonts";
import styles from "./InfoCards.module.css";

export default function InfoCard({
  label,
  children,
  color,
  placeholder,
}: {
  label: string;
  children: string;
  color?: string;
  placeholder?: boolean;
}) {
  return (
    <div className={styles.cardWrapper}>
      <p
        className={`${styles.value} ${placeholder ? redactedScript.className : ""}`}
        style={{ color: color }}
      >
        {children}
      </p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
