"use client";

import { Round as RoundType } from "@prisma/client";
import Link from "next/link";
import TimeSpan from "./TimeSpan";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function Round({ round, index }: { round: RoundType; index: number }) {
  const params = useParams<{ gameId: string; roundId: string }>();
  const pathname = usePathname().split("/").at(-1);

  return (
    <li
      ref={(node) => {
        scrollIntoView(node, round.id === params.roundId);
      }}
    >
      <Link
        href={`/game/${params.gameId}/rounds/${round.id}/${pathname}`}
        style={{ fontWeight: `${round.id === params.roundId ? "900" : "200"}` }}
      >
        Round {index + 1}{" "}
        {round.start_time && round.end_time && (
          <TimeSpan startDate={round.start_time} endDate={round.end_time} />
        )}
      </Link>
    </li>
  );
}

function scrollIntoView(node: HTMLLIElement | null, isActive: boolean) {
  if (isActive) {
    node?.scrollIntoView({ block: "start", behavior: "smooth", inline: "nearest" });
  }
}
