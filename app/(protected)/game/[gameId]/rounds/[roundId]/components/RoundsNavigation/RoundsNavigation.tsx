import { serverFetch } from "@/app/server-fetch";
import styles from "./RoundsNavigation.module.css";
import { GetRoundsResponse } from "@/app/api/games/[gameId]/rounds/route";
import Round from "./Round";

export default async function RoundsNavigation({
  params,
}: {
  params: { gameId: string; roundId: string };
}) {
  const response = await serverFetch(`/api/games/${params.gameId}/rounds`);

  if (!response.ok) {
    return <p>Error</p>;
  }

  const { rounds }: GetRoundsResponse = await response.json();

  return (
    <nav>
      <ol className={styles.nav}>
        {rounds.map((round, index) => (
          <Round round={round} key={round.id} index={index} />
        ))}
      </ol>
    </nav>
  );
}
