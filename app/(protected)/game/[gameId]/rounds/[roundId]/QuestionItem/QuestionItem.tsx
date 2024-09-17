"use client";
import { useServerLoading } from "@/app/hooks/use-server-loading";
import Tag from "@/app/ui/components/tag/tag";
import { Question, Team, TeamRoundQuestion } from "@prisma/client";
import styles from "./QuestionItem.module.css";
import AskButton from "./AskButton";
import { Text } from "@/app/ui/components/text/text";
import { fetchWithBaseUrl } from "@/app/helpers";
import { useRouter } from "next/navigation";

export default function QuestionItem({
  question,
  askedAt,
  questionDetails,
}: {
  question: Question;
  askedAt: Date | undefined;
  questionDetails: TeamRoundQuestion | undefined;
}) {
  const isLoading = useServerLoading();

  return (
    <li className={styles.questionWrapper}>
      <div>
        <div className={styles.question}>
          <Text type="title">{question.content}</Text>
          <Tag>{question.cost.toString()}</Tag>
        </div>
        {question.details && <Text type="description">{question.details}</Text>}
      </div>
      {questionDetails?.answer && <p>{questionDetails.answer}</p>}
      {!askedAt && <AskButton questionId={question.id} />}
      {askedAt && <p>Asked at: {isLoading ? "--:--" : new Date(askedAt).toLocaleTimeString()}</p>}
    </li>
  );
}

export function HiderQuestionItem({
  team,
  content,
  questionId,
  questionDetails,
}: {
  team: Team;
  content: string;
  questionId: string;
  questionDetails: TeamRoundQuestion;
}) {
  const router = useRouter();
  return (
    <div>
      <p>Asked by: {team.name}</p>
      <p>{content}</p>
      {questionDetails.answer ? (
        questionDetails.answer
      ) : (
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const answer = event.currentTarget.answer.value;
            const response = await fetchWithBaseUrl(
              `/api/questions/answer/${team.id}/${questionId}`,
              {
                body: JSON.stringify({ answer }),
                method: "POST",
              }
            );

            if (!response.ok) {
              throw Error("Error when answering");
            }
            router.refresh();
          }}
        >
          <label>
            Answer <input type="text" name="answer" />
          </label>
          <button>Answer</button>
        </form>
      )}
    </div>
  );
}
