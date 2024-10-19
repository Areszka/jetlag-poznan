import { MdOutlineErrorOutline } from "react-icons/md";
import styles from "./card.module.css";

export default function CardError({ children }: { children: string }) {
  return (
    <div className={styles.error}>
      <MdOutlineErrorOutline /> {children}
    </div>
  );
}