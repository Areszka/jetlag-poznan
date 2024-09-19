"use client";

import Tag from "@/app/ui/components/tag/tag";
import { Role } from "@prisma/client";
import styles from "./QuestionItem.module.css";
import AskButton from "./AskButton";
import React from "react";
import TimeLeftToAnswer from "./TimeLeftToAnswer";
import AnswerForm from "./AnswerForm";

type ItemStyle = "default" | "pending" | "answered";

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
  const itemStyle: ItemStyle = askedAt
    ? answer || timeLimitToAnswerQuestion < 0
      ? "answered"
      : "pending"
    : "default";

  console.log("QuestionItem RENDERED");

  return (
    <div className={`${styles.wrapper} ${styles[itemStyle]}`}>
      <div>
        <p className={styles.title}>
          {question} <Tag>{cost.toString()}</Tag>
          {"  "}
          {askedBy && <Tag hue={200}>{askedBy}</Tag>}
        </p>
        {details && <p className={styles.details}>{details}</p>}
        {answer && <p className={styles.answer}>Answer: {answer}</p>}
        {askedAt && !answer && (
          <TimeLeftToAnswer
            askedAt={askedAt}
            timeLimitToAnswerQuestion={timeLimitToAnswerQuestion}
          />
        )}
        {askedAt && !answer && userRole === "HIDER" && (
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
  );
}
