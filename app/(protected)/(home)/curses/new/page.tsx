import { CurseForm } from "@/app/(protected)/(home)/curses/CurseForm";
import Card from "@/app/ui/components/card/card";
// import { CurseForm } from "../CurseForm";

export default function Page(): JSX.Element {
  return (
    <Card title="Create curse">
      <CurseForm type="create" />
    </Card>
  );
}
