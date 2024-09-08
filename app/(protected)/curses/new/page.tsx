import { JSX } from "react";
import { CurseForm } from "@/app/(protected)/curses/CurseForm";

export default function Page(): JSX.Element {
  return <CurseForm type="create" />;
}
