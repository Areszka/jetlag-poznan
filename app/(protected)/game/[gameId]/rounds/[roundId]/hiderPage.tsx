import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import styles from "./round.module.css";
import Tag from "@/app/ui/components/tag/tag";
import ThrowCurse from "@/app/ui/throw-curse/throw-curse";
import CursesCard from "./cursesCard";
import TeamCurse from "./teamCurse";
import { HiderQuestionItem } from "./QuestionItem/QuestionItem";

export default async function HiderPage({ response }: { response: GetRoundResponse }) {
  const round = response.round;

  return (
    <>
      <div className={styles.teamsWrapper}>
        {round.teams.map(({ team, coins, role }) => {
          if (role === "HIDER") return;
          return (
            <div key={team.id} className={styles.teamWrapper}>
              <div className={styles.teamHeader}>
                {team.name} <Tag>{coins.toString()}</Tag>
              </div>
              <ThrowCurse teamId={team.id} coins={coins} />
              <div>
                {round.curses.map((curse, index) => {
                  if (curse.teamId === team.id) {
                    return (
                      <TeamCurse key={team.id + index} roundCurse={curse} curse={curse.curse} />
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {round.questions.map((question) => {
          const questionDetails = round.game.questions.find((q) => q.id === question.questionId)!;

          return (
            <HiderQuestionItem
              content={questionDetails.content}
              team={question.team}
              key={question.questionId}
              questionId={question.questionId}
              questionDetails={question}
            />
          );
          return (
            <div key={question.questionId}>
              <p>Asked by: {question.team.name}</p>
              <p>{questionDetails.content}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  console.log(event.currentTarget.answer.value);
                }}
              >
                <label>
                  Answer <input type="text" name="answer" />
                </label>
                <button>Answer</button>
              </form>
            </div>
          );
        })}
      </div>
      <CursesCard />
    </>
  );
}
