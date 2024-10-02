import { QuestionForm } from "@/app/(protected)/questions/QuestionForm";
import Card from "@/app/ui/components/card/card";

export default function Page(): JSX.Element {
  return (
    <Card title="Create new question">
      <QuestionForm type="create" />
    </Card>
  );
}
