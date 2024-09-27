import Link from "next/link";
import { Text } from "../components/text/text";
import { GetCursesResponse } from "@/app/api/curses/route";
import { serverFetch } from "@/app/server-fetch";

export async function Curses(): Promise<JSX.Element> {
  const response = await serverFetch("/api/curses");

  if (!response.ok) {
    return <p>Error questions</p>;
  }

  const data: GetCursesResponse = await response.json();

  return (
    <>
      {data.curses.map((curse) => {
        return (
          <li key={curse.id}>
            <Link href={`/curses/${curse.id}`}>
              <Text
                type="title"
                tags={[{ children: `Difficulty: ${curse.defaultDifficulty}`, hue: 270 }]}
              >
                {curse.name}
              </Text>
              <Text type="description">{curse.effect}</Text>
            </Link>
          </li>
        );
      })}
    </>
  );
}
