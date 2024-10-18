"use client";
import { fetchWithBaseUrl } from "@/app/helpers";
import { useRouter } from "next/navigation";

export default function AskButton({
  questionId,
  disabled,
}: {
  questionId: string;
  disabled: boolean;
}) {
  const router = useRouter();

  async function ask() {
    const response = await fetchWithBaseUrl(`/api/questions/ask/${questionId}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw Error("Error when asking question");
    }

    router.refresh();
  }

  return (
    <button onClick={ask} disabled={disabled}>
      Ask
    </button>
  );
}
