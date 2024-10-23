"use client";

import Item from "@/app/ui/components/Item/Item";
import { Text } from "@/app/ui/components/text/text";
import { useRoundContext } from "./TeamProvider";
import React from "react";

export default function GameCursesCard() {
  const { round } = useRoundContext();
  const curses = round.game.game_curses;

  return (
    <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
      {curses.map(({ difficulty, curseId, effect, name }) => (
        <CurseItem key={curseId} difficulty={difficulty} name={name} effect={effect} />
      ))}
    </ol>
  );
}

function CurseItem({
  difficulty,
  name,
  effect,
}: {
  difficulty: number;
  name: string;
  effect: string;
}) {
  return (
    <li>
      <Item>
        <Text type="title" tags={[{ children: difficulty.toString(), hue: 270 }]}>
          {name}
        </Text>
        <Text type="description">{effect}</Text>
      </Item>
    </li>
  );
}
