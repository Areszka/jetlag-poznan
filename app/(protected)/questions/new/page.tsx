import { JSX } from "react";
import { QuestionForm } from "@/app/(protected)/questions/QuestionForm";

export default function Page(): JSX.Element {
  return <QuestionForm type="create" />;
}
