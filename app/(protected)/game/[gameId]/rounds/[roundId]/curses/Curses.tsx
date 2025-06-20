"use client";

import useSWR from "swr";
import TeamCurseItem from "../components/CurseItem/TeamCurseItem";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import { GetGameCursesResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/curses/route";
import { useParams } from "next/navigation";
import { fetcher } from "@/app/helpers";
import ListItemPlaceholder from "@/app/ui/components/ListItemPlaceholder/ListItemPlaceholder";

export default function Curses({ teamId }: { teamId?: string }) {
  const params: { gameId: string; roundId: string } = useParams();
  const { data, isLoading, error } = useSWR<GetGameCursesResponse, any, any, any>(
    `/api/games/${params.gameId}/rounds/${params.roundId}/curses`,
    fetcher,
    { refreshInterval: 3000 }
  );

  if (isLoading) {
    return <ListItemPlaceholder />;
  }

  if (error) {
    return <p> Something went wrong!</p>;
  }

  if (!data) {
    return <p>No Data!</p>;
  }

  let curses = [];

  if (teamId) {
    curses = data.curses.filter((curse) => curse.teamId === teamId);
  } else {
    curses = data.curses;
  }

  if (curses.length === 0) {
    return <p>No curses... yet 😈</p>;
  }

  return (
    <FlexWithGap>
      {curses.map((curse) => {
        return (
          <TeamCurseItem key={`${curse.id}_${curse.teamId}_${curse.created_at}`} curse={curse} />
        );
      })}
    </FlexWithGap>
  );
}
