"use client";

import { useRouter } from "next/navigation";
import { getBaseUrl } from "../helpers";
import useSWR from "swr";
import { GetGamesResponse } from "@/app/api/games/route";
import Link from "next/link";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function Game() {
  const { data, isLoading, error } = useSWR<GetGamesResponse>(`${getBaseUrl()}/api/games`, fetcher);
  const router = useRouter();

  return (
    <>
      {isLoading && <p>Loading Games...</p>}
      {data && (
        <ol>
          {data.games.map((game) => {
            return (
              <li key={game.id}>
                <Link href={`/game/${game.id}`}>{game.name}</Link>
              </li>
            );
          })}
        </ol>
      )}

      <button onClick={() => router.push("/game/create")}>Create new Game</button>
    </>
  );
}
