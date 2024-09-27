import { ComponentProps } from "react";
import styles from "./button.module.css";
import Link from "next/link";

type Props = ComponentProps<"button">;

export function Button(props: Props) {
  return <button className={styles.button} {...props} />;
}

export function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className={styles.button} href={href}>
      {children}
    </Link>
  );
}
