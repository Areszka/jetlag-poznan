import UserProvider from "./UserProvider";
import { validateSession } from "../api/auth";
import { db } from "../api/db";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await validateSession();
  const { username } = await db.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  return <UserProvider user={{ username, id: userId }}>{children}</UserProvider>;
}
