import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import styles from "./round.module.css";
import NewRoundButton from "./newRoundButton";

export default async function SummaryPage({ response }: { response: GetRoundResponse }) {
  return (
    <>
      <h1>Summary Page</h1>
      <div className={styles.teamsWrapper}></div>
      <NewRoundButton />
    </>
  );
}
