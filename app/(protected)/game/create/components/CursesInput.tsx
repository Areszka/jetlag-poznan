import { motion } from "framer-motion";
import React from "react";
import styles from "../page.module.css";
import { Text } from "@/app/ui/components/text/text";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import useSWR from "swr";
import { fetcher } from "@/app/helpers";
import { GetCursesResponse } from "@/app/api/curses/route";
import ListItemPlaceholder from "@/app/ui/components/ListItemPlaceholder/ListItemPlaceholder";

export default function CursesInput({
  curses,
  initializeCurses,
  changeCurseDifficulty,
}: {
  curses: { id: string; difficulty: number }[];
  changeCurseDifficulty: (id: string, difficulty: number) => void;
  initializeCurses: (curses: { id: string; difficulty: number }[]) => void;
}) {
  const { data, error, isLoading } = useSWR<GetCursesResponse>("/api/curses", fetcher, {
    onSuccess: (data) => {
      if (curses.length === 0) {
        initializeCurses(
          data.curses.map((curse) => {
            return { id: curse.id, difficulty: Math.min(curse.defaultDifficulty ?? 1, 3) };
          })
        );
      }
    },
  });

  if (error) {
    return <div>Error loading questions</div>;
  }

  if (isLoading) {
    return (
      <ul>
        <ListItemPlaceholder />
        <ListItemPlaceholder />
        <ListItemPlaceholder />
      </ul>
    );
  }

  return (
    <ul>
      {curses.map(({ id }, index) => {
        const curse = data!.curses.find((curse) => curse.id === id)!;
        return (
          <li key={id} className={styles.curse}>
            <div className={styles.curseDifficulty}>
              <Text type="description">Difficulty</Text>
              <input
                type="number"
                min={1}
                max={3}
                value={curses[index].difficulty}
                onChange={(e) => {
                  const number = Number.isNaN(parseInt(e.target.value))
                    ? 1
                    : parseInt(e.target.value);
                  const difficulty = Math.max(1, Math.min(3, number));
                  changeCurseDifficulty(id, difficulty);
                }}
              />
            </div>
            <FlexWithGap gap={0}>
              <Text type="title">{curse.name}</Text>
              <Text type="description">{curse.effect}</Text>
            </FlexWithGap>
          </li>
        );
      })}
    </ul>
  );
}
