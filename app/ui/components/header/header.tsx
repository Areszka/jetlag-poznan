import styles from "./header.module.css";

export default function Header({ children }: { children: string }) {
  return <h2 className={styles.h2}>{children}</h2>;
}
