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
  curseIds,
  initializeCurses,
  moveCurseUp,
  moveCurseDown,
}: {
  curseIds: string[];
  moveCurseUp: (id: string) => void;
  moveCurseDown: (id: string) => void;
  initializeCurses: (curseIds: string[]) => void;
}) {
  const { data, error, isLoading } = useSWR<GetCursesResponse>("/api/curses", fetcher, {
    onSuccess: (data) => {
      if (curseIds.length === 0) {
        initializeCurses(data.curses.map((curse) => curse.id));
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
      {curseIds.map((curseId, index) => {
        const curse = data!.curses.find((curse) => curse.id === curseId)!;
        return (
          <motion.li key={curseId} className={styles.curse} layout={true}>
            <div className={styles.curseButtons}>
              {index > 0 && (
                <button type="button" onClick={() => moveCurseUp(curseId)}>
                  <IoIosArrowUp />
                </button>
              )}
              {index !== curseIds.length - 1 && (
                <button type="button" onClick={() => moveCurseDown(curseId)}>
                  <IoIosArrowDown />
                </button>
              )}
            </div>
            <FlexWithGap gap={0}>
              <Text type="title">{curse.name}</Text>
              <Text type="description">{curse.effect}</Text>
            </FlexWithGap>
          </motion.li>
        );
      })}
    </ul>
  );
}
