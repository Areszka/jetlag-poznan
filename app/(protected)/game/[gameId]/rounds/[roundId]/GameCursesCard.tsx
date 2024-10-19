"use client";

import { useRoundContext } from "./TeamProvider";
import Card from "@/app/ui/components/card/card";
import CurseItem from "@/app/ui/components/curse-item/curse-item";
import React from "react";

export default function GameCursesCard() {
  const { round } = useRoundContext();
  const curses = round.game.game_curses;

  return (
    <Card title="Curses">
      <ol>
        {curses.map(({ difficulty, curseId, effect, name }) => (
          <CurseItem key={curseId} difficulty={difficulty} name={name} effect={effect} />
        ))}
      </ol>
    </Card>
  );
}
