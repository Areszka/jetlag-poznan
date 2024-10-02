import { CurseForm } from "@/app/(protected)/curses/CurseForm";
import Card from "@/app/ui/components/card/card";

export default function Page(): JSX.Element {
  return (
    <Card title="Create curse">
      <CurseForm type="create" />
    </Card>
  );
}
