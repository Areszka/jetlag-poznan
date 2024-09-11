import styles from "./throw-curse.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function DiceControls({
  addDice,
  removeDice,
}: {
  addDice: () => void;
  removeDice: () => void;
}) {
  return (
    <div className={styles.diceButtons}>
      <button onClick={removeDice}>
        <IoIosArrowDown />
      </button>
      <button onClick={addDice}>
        <IoIosArrowUp />
      </button>
    </div>
  );
}
