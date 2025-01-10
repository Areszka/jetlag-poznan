"use client";

import useSWR from "swr";
import { GetGameQuestionsResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/questions/route";
import { QuestionItem } from "../components/QuestionItem/QuestionItem";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import { fetcher } from "@/app/helpers";
import Loader from "./loading";
import Center from "@/app/ui/components/Center/Center";

export default function Page({ params }: { params: { gameId: string; roundId: string } }) {
  const { data, isLoading, error } = useSWR<GetGameQuestionsResponse, Error, string, any>(
    `/api/games/${params.gameId}/rounds/${params.roundId}/questions`,
    fetcher,
    { refreshInterval: 3000 }
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Center>Something went wrong!</Center>;
  }

  if (!data) {
    return <Center>No Data!</Center>;
  }

  if (data.questions.length === 0) {
    return <Center>No questions yet!</Center>;
  }

  return (
    <FlexWithGap>
      {data.questions.map((question) => (
        <QuestionItem key={`${question.id}_${question.askedBy?.id ?? ""}`} question={question} />
      ))}
    </FlexWithGap>
  );
}
