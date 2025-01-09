"use client";

import styles from "./BottomNavigation.module.css";
import useSWR from "swr";
import { GetPendingQuestionsResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/numberOfPendingQuestions/route";
import { GetActiveCursesResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/numberOfActiveCurses/route";
import { fetcher } from "@/app/helpers";

export function PendingQuestionsBadge({ params }: { params: { gameId: string; roundId: string } }) {
  const { data } = useSWR<GetPendingQuestionsResponse, any, any, any>(
    `/api/games/${params.gameId}/rounds/${params.roundId}/numberOfPendingQuestions`,
    fetcher,
    { refreshInterval: 2000 }
  );

  if (!data?.pendingQuestions) {
    return;
  }

  return <Badge>{data.pendingQuestions.toString()}</Badge>;
}

export function ActiveCursesBadge({ params }: { params: { gameId: string; roundId: string } }) {
  const { data } = useSWR<GetActiveCursesResponse, any, any, any>(
    `/api/games/${params.gameId}/rounds/${params.roundId}/numberOfActiveCurses`,
    fetcher,
    { refreshInterval: 2000 }
  );

  if (!data?.activeCurses) {
    return;
  }

  return <Badge>{data.activeCurses.toString()}</Badge>;
}

function Badge({ children }: { children: string }) {
  return <div className={styles.badge}>{children}</div>;
}
