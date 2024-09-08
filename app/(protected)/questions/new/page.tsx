"use client";
import { JSX } from "react";
import { useRouter } from "next/navigation";
import { PostQuestionsRequest } from "@/app/api/questions/route";

export default function Page(): JSX.Element {
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
        fetch("/api/questions", {
          method: "POST",
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
        <input name="content" />
      </label>
      <label>
        Cost
        <input name="cost" type="number" />
      </label>
      <label>
        Type
        <input name="type" />
      </label>
      <label>
        Details
        <textarea name="details" />
      </label>
      <button type="submit">Create question</button>
    </form>
  );
}
