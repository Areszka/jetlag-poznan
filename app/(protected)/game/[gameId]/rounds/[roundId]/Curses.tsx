"use client";

import TeamCurseItem from "./CurseItem/TeamCurseItem";
import { useRoundContext } from "./TeamProvider";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";

export default function Curses({ teamId }: { teamId?: string }) {
  const { round } = useRoundContext();

  const curses = (() => {
    if (teamId) {
      return round.curses.filter((curse) => curse.teamId === teamId);
    } else {
      return round.curses;
    }
  })();

  if (curses.length === 0) {
    return <p>No curses yet!</p>;
  }

  return (
    <FlexWithGap>
      {curses.map((curse) => {
        return <TeamCurseItem key={curse.curseId} curse={curse.curse} roundCurse={curse} />;
      })}
    </FlexWithGap>
  );
}
