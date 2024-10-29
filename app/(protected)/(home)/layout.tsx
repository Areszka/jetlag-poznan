import { Navigation } from "@/app/ui/navigation";
import styles from "./page.module.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <div className={styles.pageWrapper}>{children}</div>
    </>
  );
}
