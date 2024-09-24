import Tag, { TagProps } from "../tag/tag";
import styles from "./text.module.css";

type Type = "title" | "description" | "subtitle";

export function Text({
  children,
  type,
  tags,
}: {
  children: string;
  type: Type;
  tags?: TagProps[];
}) {
  return (
    <p className={styles[type]}>
      {children}{" "}
      {tags?.map(({ children, hue }, index) => {
        return (
          <span key={index}>
            <Tag hue={hue}>{children}</Tag>{" "}
          </span>
        );
      })}
    </p>
  );
}
