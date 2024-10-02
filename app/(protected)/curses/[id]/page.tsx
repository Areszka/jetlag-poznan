import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { CurseForm } from "@/app/(protected)/curses/CurseForm";
import Card from "@/app/ui/components/card/card";

export default async function Page({ params }: { params: { id: string } }) {
  const userId = await validateSession();
  const initialValues = await db.curse.findFirstOrThrow({
    where: {
      id: params.id,
      ownerId: userId,
    },
  });
  console.log("initial", initialValues);
  return (
    <Card title="Edit curse">
      <CurseForm type="edit" initialValues={initialValues} id={params.id} />
    </Card>
  );
}
