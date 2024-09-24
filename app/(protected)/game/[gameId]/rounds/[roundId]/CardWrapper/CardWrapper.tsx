import styles from "./CardWrapper.module.css";

export function CardWrapper({ children }: { children: JSX.Element | JSX.Element[] }) {
  return <div className={styles.wrapper}>{children}</div>;
}
