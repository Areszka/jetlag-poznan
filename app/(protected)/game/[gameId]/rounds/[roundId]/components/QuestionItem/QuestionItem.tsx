import styles from "./QuestionItem.module.css";
import AskButton from "./AskButton";
import React from "react";
import TimeLeftToAnswer from "./TimeLeftToAnswer";
import AnswerForm from "./AnswerForm";
import Item from "@/app/ui/components/Item/Item";
import { Text } from "@/app/ui/components/text/text";
import { FlatQuestion } from "@/app/api/games/[gameId]/rounds/[roundId]/questions/route";

export function QuestionItem({ question }: { question: FlatQuestion }) {
  const answerIsPending = question.created_at !== null && !question.answer;

  return (
    <Item style={answerIsPending ? "orange" : undefined}>
      <div className={`${styles.wrapper}`}>
        <div>
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
        {!question.answer && !answerIsPending && <AskButton questionId={question.id} />}
      </div>
    </Item>
  );
}
