import { GetGamesResponse } from "@/app/api/games/route";
import Link from "next/link";
import { serverFetch } from "../server-fetch";
import { Text } from "./components/text/text";

export default async function Games() {
  const response = await serverFetch("/api/games");

  if (!response.ok) {
    return <p>Error when fetching games</p>;
  }

  const data: GetGamesResponse = await response.json();

  return (
    <>
      {data.games.map((game) => (
        <li key={game.id}>
          <Link href={`/game/${game.id}/rounds/${game.rounds.at(-1)?.id}`}>
            <Text type="title" tags={game.isActive ? [{ children: "active", hue: 0 }] : undefined}>
              {game.name}
            </Text>
          </Link>
        </li>
      ))}
    </>
  );
}
