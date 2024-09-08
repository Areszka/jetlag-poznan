"use client";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { PostCursesRequest } from "@/app/api/curses/route";

export function CurseForm({
  type,
  id,
  initialValues,
}: {
  type: "create" | "edit";
  id?: string;
  initialValues?: PostCursesRequest;
}): JSX.Element {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const requestBody: PostCursesRequest = {
          effect: e.currentTarget.effect.value,
          defaultDifficulty: parseInt(e.currentTarget.defaultDifficulty.value),
          name: e.currentTarget.curseName.value,
        };
        fetch(type === "create" ? "/api/curses" : `/api/curses/${id}`, {
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
        Name
        <input name="curseName" defaultValue={initialValues?.name} />
      </label>
      <label>
        Effect
        <textarea name="effect" defaultValue={initialValues?.effect} />
      </label>
      <label>
        Default Difficulty
        <input
          name="defaultDifficulty"
          type="number"
          defaultValue={initialValues?.defaultDifficulty ?? undefined}
        />
      </label>
      <button type="submit">
        {type === "create" ? "Create" : "Update"} curse
      </button>
    </form>
  );
}
