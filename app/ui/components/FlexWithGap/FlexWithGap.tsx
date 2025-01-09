import { CSSProperties } from "react";
import styles from "./FlexWithGap.module.css";

export default function FlexWithGap({
  children,
  gap,
  flexDirection,
}: {
  children: React.ReactNode;
  gap?: number;
  flexDirection?: "column" | "row";
}) {
  return (
    <div className={styles.wrapper} style={{ gap: `${gap}px`, flexDirection } as CSSProperties}>
      {children}
    </div>
  );
}
