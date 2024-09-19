import { CSSProperties } from "react";
import styles from "./tag.module.css";

export default function Tag({
  hue = 54,
  children,
}: {
  hue?: number;
  children: JSX.Element | string;
}) {
  return (
    <span className={styles.tag} style={{ "--hue": hue } as CSSProperties}>
      {children}
    </span>
  );
}
