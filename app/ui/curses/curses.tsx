import { JSX } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { fetchWithBaseUrl } from "../../helpers";
import Card from "../components/card/card";
import { Text } from "../components/text/text";
import styles from "./curses.module.css";
import { GetCursesResponse } from "@/app/api/curses/route";

export async function Curses(): Promise<JSX.Element> {
  const headersList = headers();
  const cookieHeader = headersList.get("cookie") || "";

  const response = await fetchWithBaseUrl(`/api/curses`, {
    headers: {
      Cookie: cookieHeader, // Forward cookies here
    },
  });

  if (!response.ok) {
    return <p>Error questions</p>;
  }

  const data = (await response.json()) as GetCursesResponse;
  return (
    <Card title="Curses">
      <Link href="/curses/new">Add new curse</Link>
      <ul>
        {data.curses.map((curse) => {
          return (
            <li key={curse.id} className={styles.curseWrapper}>
              <Link href={`/curses/${curse.id}`}>
                <div className={styles.curse}>
                  <Text type="title">{curse.name}</Text>
                  <span>{curse.defaultDifficulty}</span>
                </div>
                <Text type="description">{curse.effect}</Text>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
