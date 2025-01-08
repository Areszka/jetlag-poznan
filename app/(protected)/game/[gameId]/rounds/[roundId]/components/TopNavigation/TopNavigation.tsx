"use client";

import styles from "./TopNavigation.module.css";
import { FaRegClock } from "react-icons/fa6";
import useGameTime from "@/app/hooks/use-game-time";
import { useRoundContext } from "../RoundProvider";
import { getTime } from "@/app/helpers";
import GameControlButton from "../GameButtons/GameControlButton";

export function TopNavigation() {
  const { round } = useRoundContext();
  const time = useGameTime({ endTime: round.end_time, startTime: round.start_time });

  return (
    <nav className={styles.nav}>
      <div className={styles.timer}>
        <FaRegClock size="24px" />
        <p>{getTime(time)}</p>
      </div>
      <div className={styles.button}>
        <GameControlButton />
      </div>
    </nav>
  );
}
