import { getBaseUrl } from "../../helpers";
import Tag from "../tag/tag";
import styles from "./questions.module.css";

export async function Questions(): Promise<JSX.Element> {
  const response = await fetch(`${getBaseUrl()}/api/questions`);

  if (!response.ok) {
    return <p>Error questions</p>;
  }

  const data = await response.json();
  return (
    <ul className={styles.wrapper}>
      <h2>Questions</h2>
      {data.questions.map((question: any) => {
        return (
          <li key={question.id} className={styles.question}>
            <div className={styles.questionWrapper}>
              <p className={styles.content}>{question.content} </p>
              <Tag>{question.cost}</Tag> <Tag hue={HUES[question.type]}>{question.type}</Tag>
            </div>

            {question.details && <p className={styles.details}>{question.details}</p>}
          </li>
        );
      })}
    </ul>
  );
}

const HUES: Record<string, number> = {
  Dziwne: 120,
  Relatywne: 0,
  Radar: 30,
  Zdjęcia: 180,
  Precyzyjne: 240,
  "Tak/Nie": 310,
};
