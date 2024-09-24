import styles from "./Item.module.css";

type ItemStyle = "default" | "red" | "orange";

export default function Item({ children, style }: { children: JSX.Element; style?: ItemStyle }) {
  return <div className={`${styles.item} ${style ? styles[style] : ""}`}>{children}</div>;
}
