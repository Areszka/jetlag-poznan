import { ReactNode } from "react";
import styles from "./page.module.css";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={styles.layout}>{children}</div>;
}
