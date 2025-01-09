import styles from "./page.module.css";
import Card from "@/app/ui/components/card/card";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <Card title="Create New Game">{children}</Card>
    </div>
  );
}
