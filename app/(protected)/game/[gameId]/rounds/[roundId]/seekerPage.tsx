import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import React from "react";
export default function SeekerPage({ response }: { response: GetRoundResponse }) {
  return (
    <>
      <div>
        {response.round.curses.map((curse) => {
          return <p key={curse.curseId}>{curse.curse.name}</p>;
        })}
      </div>
    </>
  );
}
