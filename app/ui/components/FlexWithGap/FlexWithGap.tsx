import { CSSProperties } from "react";
import styles from "./FlexWithGap.module.css";

export default function FlexWithGap({
  gap,
  children,
}: {
  gap?: number;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper} style={{ gap: `${gap}px` } as CSSProperties}>
      {children}
    </div>
  );
}
