import { GetRoundsResponse } from "@/app/api/games/[gameId]/rounds/route";
import { serverFetch } from "@/app/server-fetch";
import styles from "./layout.module.css";
import Link from "next/link";

export default async function Layout({
  children,
  params,
}: {
  children: JSX.Element;
  params: { gameId: string };
}) {
  const response = await serverFetch(`/api/games/${params.gameId}/rounds`);

  if (!response.ok) {
    return <p>Error</p>;
  }

  const data: GetRoundsResponse = await response.json();

  return (
    <div>
      <ol className={styles.rounds}>
        {data.rounds.map((round, index) => (
          <li key={round.id}>
            <Link href={`/game/${params.gameId}/rounds/${round.id}`}>Round {index + 1}</Link>
          </li>
        ))}
      </ol>
      {children}
    </div>
  );
}
