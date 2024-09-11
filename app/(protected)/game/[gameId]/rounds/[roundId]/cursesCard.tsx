"use client";

import { GetGameCursesResponse } from "@/app/api/games/[gameId]/curses/route";
import { fetchWithBaseUrl } from "@/app/helpers";
import Card from "@/app/ui/components/card/card";
import CurseItem from "@/app/ui/components/curse-item/curse-item";
import { useParams } from "next/navigation";
import React from "react";

export default function CursesCard() {
  const [data, setData] = React.useState<GetGameCursesResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const params = useParams();

  React.useEffect(() => {
    async function getData() {
      const response = await fetchWithBaseUrl(`/api/games/${params.gameId}/curses`);

      if (response.ok) {
        const d: GetGameCursesResponse = await response.json();
        setData(d);
        setIsLoading(false);
      }
    }

    getData();
  }, []);

  if (isLoading) {
    return (
      <Card title="Curses">
        <div
          style={{
            display: "grid",
            placeContent: "center",
          }}
        >
          Loading curses...
        </div>
      </Card>
    );
  }

  if (!data) {
    return <p>Error</p>;
  }

  return (
    <Card title="Curses">
      <ol>
        {data.curses.map(({ difficulty, curseId, curse }) => (
          <CurseItem
            key={curseId}
            difficulty={difficulty}
            name={curse.name}
            effect={curse.effect}
          />
        ))}
      </ol>
    </Card>
  );
}
