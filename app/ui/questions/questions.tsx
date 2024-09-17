import { JSX } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { fetchWithBaseUrl } from "../../helpers";
import Card from "../components/card/card";
import { Text } from "../components/text/text";
import Tag from "../components/tag/tag";
import styles from "./questions.module.css";
import { serverFetch } from "@/app/server-fetch";

export async function Questions(): Promise<JSX.Element> {
  const response = await serverFetch(`/api/questions`);

  if (!response.ok) {
    return <p>Error questions</p>;
  }

  const data = await response.json();
  return (
    <Card title="Questions">
      <Link href="/questions/new">Add new question</Link>
      <ul>
        {data.questions.map((question: any) => {
          return (
            <li key={question.id} className={styles.questionWrapper}>
              <Link href={`/questions/${question.id}`}>
                <div className={styles.question}>
                  <Text type="title">{question.content}</Text>
                  <Tag>{question.cost}</Tag> <Tag hue={HUES[question.type]}>{question.type}</Tag>
                </div>
                {question.details && <Text type="description">{question.details}</Text>}
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
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
