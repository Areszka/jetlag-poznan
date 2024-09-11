import styles from "./curse-item.module.css";

export default function CurseItem({
  difficulty,
  name,
  effect,
}: {
  difficulty: number;
  name: string;
  effect: string;
}) {
  return (
    <li className={styles.wrapper}>
      <div className={styles.difficulty}>{difficulty}</div>
      <div className={styles.textWrapper}>
        <p className={styles.name}>{name}</p>
        <p className={styles.effect}>{effect}</p>
      </div>
    </li>
  );
}
