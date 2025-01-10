import styles from "./ListItemPlaceholder.module.css";

export default function ListItemPlaceholder({ height }: { height?: string }) {
  return <div className={styles.placeholder} style={{ height }}></div>;
}
