import { GetRoundsResponse } from "@/app/api/games/[gameId]/rounds/route";
import { serverFetch } from "@/app/server-fetch";
import Link from "next/link";
import TimeSpan from "./timeSpan";
import styles from "./round.module.css";
import Navbar from "./components/Navbar/Navbar";
import RoundProvider from "./RoundProvider";
import GameProvider from "./GameProvider";

export default async function Layout({
  children,
  params,
}: {
  children: JSX.Element;
  params: { gameId: string; roundId: string };
}) {
  const response = await serverFetch(`/api/games/${params.gameId}/rounds`);

  if (!response.ok) {
    return <p>Error</p>;
  }

  const { rounds }: GetRoundsResponse = await response.json();

  return (
    <>
      <ol className={styles.rounds}>
        {rounds.map((round, index) => (
          <li key={round.id}>
            <Link
              href={`/game/${params.gameId}/rounds/${round.id}`}
              className={round.id === params.roundId ? styles.active : ""}
            >
              Round {index + 1}{" "}
              {round.start_time && round.end_time && (
                <TimeSpan startDate={round.start_time} endDate={round.end_time} />
              )}
            </Link>
          </li>
        ))}
      </ol>
      <GameProvider>
        <RoundProvider>
          <div className={styles.pageWrapper}>{children}</div>
        </RoundProvider>
      </GameProvider>
      <Navbar params={params} />
    </>
  );
}
