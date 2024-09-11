import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import styles from "./round.module.css";

export default async function SeekerPage({ response }: { response: GetRoundResponse }) {
  const gameIsRunning = !!response.round.end_time;
  return (
    <>
      <h1>Seeker Page</h1>
      {gameIsRunning && <button className={styles.button}>Stop Game</button>}
      {!gameIsRunning && <button className={styles.button}>Start Game</button>}
      <div className={styles.teamsWrapper}></div>
    </>
  );
}
