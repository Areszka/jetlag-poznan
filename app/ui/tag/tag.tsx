import { CSSProperties } from "react";
import styles from "./tag.module.css";

export default function Tag({ hue = 54, children }: { hue?: number; children: JSX.Element }) {
  return (
    <div className={styles.tag} style={{ "--hue": hue } as CSSProperties}>
      {children}
    </div>
  );
}
