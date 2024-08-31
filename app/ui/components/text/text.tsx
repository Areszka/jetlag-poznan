import styles from "./text.module.css";

type Type = "title" | "description";

export function Text({ children, type }: { children: string; type: Type }) {
  return <p className={styles[type]}>{children}</p>;
}
