import styles from "./ListWrapper.module.css";

export default function ListWrapper({ children }: { children: React.ReactNode }) {
  return <ul className={styles.wrapper}>{children}</ul>;
}
