import Link from "next/link";
import { Text } from "../components/text/text";
import { serverFetch } from "@/app/server-fetch";

export async function Questions(): Promise<JSX.Element> {
  const response = await serverFetch(`/api/questions`);

  if (!response.ok) {
    return <p>Error questions</p>;
  }

  const data = await response.json();
  return (
    <>
      {data.questions.map((question: any) => {
        return (
          <li key={question.id}>
            <Link href={`/questions/${question.id}`}>
              <Text
                type="title"
                tags={
                  question.type
                    ? [
                        { children: question.cost },
                        { children: question.type, hue: HUES[question.type] ?? 200 },
                      ]
                    : [{ children: question.cost }]
                }
              >
                {question.content}
              </Text>
              {question.details && <Text type="description">{question.details}</Text>}
            </Link>
          </li>
        );
      })}
    </>
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
