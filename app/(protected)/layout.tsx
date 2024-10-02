import { Navigation } from "@/app/ui/navigation";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import styles from "./page.module.css";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await validateSession();
  const user = await db.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  return (
    <>
      <Navigation username={user.username} />
      <div className={styles.pageWrapper}>{children}</div>
    </>
  );
}
