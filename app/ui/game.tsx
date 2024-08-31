"use client";

import { getBaseUrl } from "../helpers";
import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function Game() {
  const { data, isLoading, error } = useSWR(`${getBaseUrl()}/api/games`, fetcher);

  return (
    <>
      {isLoading && <p>Loading Games...</p>}
      {data &&
        data.map((row) => {
          return (
            <p>
              {row.id} - {row.name} - {row.time_start}
            </p>
          );
        })}

      <button
        onClick={async () => {
          const response = await fetch(`${getBaseUrl()}/api/games`, {
            method: "POST",
            body: JSON.stringify({ name: "Nowa gra Filipa" }),
          });
        }}
      >
        Create new Game
      </button>
    </>
  );
}
