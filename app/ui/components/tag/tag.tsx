import { CSSProperties } from "react";
import styles from "./tag.module.css";

export type TagProps = {
  hue?: number;
  children: JSX.Element | string;
};

export default function Tag({ hue = 54, children }: TagProps) {
  return (
    <span className={styles.tag} style={{ "--hue": hue } as CSSProperties}>
      {children}
    </span>
  );
}
