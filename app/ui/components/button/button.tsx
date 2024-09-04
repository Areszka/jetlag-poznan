import { ComponentProps } from "react";
import styles from "./button.module.css";

type Props = ComponentProps<"button">;

export function Button(props: Props) {
  return <button className={styles.button} {...props} />;
}
