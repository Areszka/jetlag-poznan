import styles from "./GameButton.module.css";

type Props = {
  children: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function GameButton({ children, onClick, disabled }: Props) {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
