import styles from "./VerticalLabel.module.css";

export function VerticalLabel({ children }: { children: React.ReactNode }) {
  return <label className={styles.verticalLabel}>{children}</label>;
}
