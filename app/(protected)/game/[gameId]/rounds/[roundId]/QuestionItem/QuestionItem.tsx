import { TagProps } from "@/app/ui/components/tag/tag";
import { Role } from "@prisma/client";
import styles from "./QuestionItem.module.css";
import AskButton from "./AskButton";
import React from "react";
import TimeLeftToAnswer from "./TimeLeftToAnswer";
import AnswerForm from "./AnswerForm";
import Item from "@/app/ui/components/Item/Item";
import { Text } from "@/app/ui/components/text/text";

export default function QuestionItem({
  question,
  askedAt,
  details,
  cost,
  answer,
  userRole,
  questionId,
  askedBy,
  timeLimitToAnswerQuestion,
  ownerTeamId,
}: {
  question: string;
  questionId: string;
  details: string | null;
  cost: number;
  askedAt: Date | null;
  answer: string | null;
  userRole: Role;
  askedBy?: string;
  timeLimitToAnswerQuestion: number;
  ownerTeamId?: string;
}) {
  const isAnswerPending = askedAt && !answer;

  function getTitleTags() {
    let titleTags: Array<TagProps> = [{ children: cost.toString() }];
    if (askedBy) {
      titleTags.push({ children: askedBy, hue: 200 });
    }

    return titleTags;
  }

  return (
    <Item style={isAnswerPending ? "orange" : undefined}>
      <div className={`${styles.wrapper}`}>
        <div>
          <Text type="title" tags={getTitleTags()}>
            {question}
          </Text>
          {details && <p className={styles.details}>{details}</p>}
          {answer && <p className={styles.answer}>Answer: {answer}</p>}
          {isAnswerPending && (
            <TimeLeftToAnswer
              askedAt={askedAt}
              timeLimitToAnswerQuestion={timeLimitToAnswerQuestion}
            />
          )}
          {isAnswerPending && userRole === "HIDER" && (
            <AnswerForm
              askedAt={askedAt}
              ownerTeamId={ownerTeamId}
              questionId={questionId}
              timeLimitToAnswerQuestion={timeLimitToAnswerQuestion}
              userRole={userRole}
            />
          )}
        </div>
        {!askedAt && userRole === "SEEKER" && <AskButton questionId={questionId} />}
      </div>
    </Item>
  );
}
