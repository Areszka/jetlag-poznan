import styles from "./InfoCards.module.css";

export default function InfoCard({
  label,
  children,
  color,
}: {
  label: string;
  children: string;
  color?: string;
}) {
  return (
    <div className={styles.cardWrapper}>
      <p className={styles.value} style={{ color: color }}>
        {children}
      </p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
