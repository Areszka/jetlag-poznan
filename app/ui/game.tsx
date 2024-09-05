"use client";

import { useRouter } from "next/navigation";
import { getBaseUrl } from "../helpers";
import useSWR from "swr";
import { Game as GameType } from "@prisma/client";
import { GetGamesResponse } from "@/app/api/games/route";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export default function Game() {
  const { data, isLoading, error } = useSWR<GetGamesResponse>(
    `${getBaseUrl()}/api/games`,
    fetcher,
  );
  const router = useRouter();

  return (
    <>
      {isLoading && <p>Loading Games...</p>}
      {data &&
        data.games.map((row) => {
          return (
            <p key={row.id}>
              {row.id} - {row.name}
            </p>
          );
        })}

      <button onClick={() => router.push("/game/create")}>
        Create new Game
      </button>
    </>
  );
}
