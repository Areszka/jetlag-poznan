"use client";

import styles from "./QuestionItem.module.css";
import AskButton from "./AskButton";
import React from "react";
import TimeLeftToAnswer from "./TimeLeftToAnswer";
import AnswerForm from "./AnswerForm";
import Item from "@/app/ui/components/Item/Item";
import { Text } from "@/app/ui/components/text/text";
import { sendNotification } from "@/app/utils/actions";
import { useRouter } from "next/navigation";
import useUserTeam from "@/app/hooks/use_user_team";
import { FlatQuestion } from "@/app/api/games/[gameId]/rounds/[roundId]/questions/route";
import useHidersIds from "@/app/hooks/use_hiders_ids";

export function QuestionItem({ question }: { question: FlatQuestion }) {
  const router = useRouter();
  const { userTeam } = useUserTeam();
  const { hidersIds } = useHidersIds();

  const answerIsPending = question.created_at !== null && !question.answer;

  return (
    <Item style={answerIsPending ? "orange" : undefined}>
      <div className={`${styles.wrapper}`}>
        <div>
          {new Date(question.created_at ?? 0).toLocaleTimeString()}
          {new Date(question.created_at ?? 0).toLocaleDateString()}
          {question.askedBy && <p className={styles.askedBy}>{question.askedBy.name}</p>}
          <Text type="title" tags={[{ children: question.cost.toString() }]}>
            {question.content}
          </Text>
          {question.details && <p className={styles.details}>{question.details}</p>}
          {question.answer && <p className={styles.answer}>Answer: {question.answer}</p>}
          {answerIsPending && <TimeLeftToAnswer askedAt={question.created_at!} />}
          {answerIsPending && question.askedBy !== undefined && (
            <AnswerForm
              askedAt={question.created_at!}
              ownerTeamId={question.askedBy.id}
              questionId={question.id}
            />
          )}
        </div>
        {!question.answer && !answerIsPending && <AskButton onClick={sendQuestion} />}
      </div>
    </Item>
  );

  async function sendQuestion() {
    const response = await fetch(`/api/questions/ask/${question.id}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw Error("Error when asking question");
    }
    await sendNotification(`New question from ${userTeam.name}`, question.content, hidersIds!);

    router.refresh();
  }
}
