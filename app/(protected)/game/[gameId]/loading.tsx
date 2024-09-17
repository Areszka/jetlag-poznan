import styles from "./layout.module.css";

export default async function Loading({ children }: { children: JSX.Element }) {
  return (
    <div>
      <ol className={styles.rounds}>
        <li>Fetching rounds...</li>
      </ol>
      {children}
    </div>
  );
}
