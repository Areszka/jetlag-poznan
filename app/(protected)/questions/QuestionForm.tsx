"use client";
import { useRouter } from "next/navigation";
import { PostQuestionsRequest } from "@/app/api/questions/route";
import { JSX } from "react";

export function QuestionForm({
  type,
  id,
  initialValues,
}: {
  type: "create" | "edit";
  id?: string;
  initialValues?: PostQuestionsRequest;
}): JSX.Element {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const requestBody: PostQuestionsRequest = {
          content: e.currentTarget.content.value,
          cost: parseInt(e.currentTarget.cost.value),
          type: e.currentTarget.type.value,
          details: e.currentTarget.details.value,
        };
        fetch(type === "create" ? "/api/questions" : `/api/questions/${id}`, {
          method: type === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }).then((res) => {
          if (res.ok) {
            router.push("/");
          }
        });
      }}
    >
      <label>
        Content
        <input name="content" defaultValue={initialValues?.content} />
      </label>
      <label>
        Cost
        <input name="cost" type="number" defaultValue={initialValues?.cost} />
      </label>
      <label>
        Type
        <input name="type" defaultValue={initialValues?.type} />
      </label>
      <label>
        Details
        <textarea
          name="details"
          defaultValue={initialValues?.details ?? undefined}
        />
      </label>
      <button type="submit">
        {type === "create" ? "Create" : "Update"} question
      </button>
    </form>
  );
}
