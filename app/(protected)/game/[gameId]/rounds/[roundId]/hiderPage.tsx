import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import styles from "./round.module.css";
import Tag from "@/app/ui/components/tag/tag";
import ThrowCurse from "@/app/ui/throw-curse/throw-curse";
import CursesCard from "./cursesCard";
import QuestionItem from "./QuestionItem/QuestionItem";
import Header from "@/app/ui/components/header/header";
import TeamCurseItem, { CursesWrapper } from "./CurseItem/TeamCurseItem";

export default function HiderPage({ response }: { response: GetRoundResponse }) {
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
              <ThrowCurse
                teamId={team.id}
                coins={coins}
                costPerDice={response.round.game.dice_cost}
              />
              <CursesWrapper>
                <>
                  {round.curses.map((curse, index) => {
                    if (curse.teamId === team.id) {
                      return (
                        <TeamCurseItem
                          key={team.id + index}
                          userRole="HIDER"
                          roundCurse={curse}
                          curse={curse.curse}
                        />
                      );
                    }
                  })}
                </>
              </CursesWrapper>
            </div>
          );
        })}
      </div>
      <Header>Questions</Header>
      <div className={styles.questionsWrapper}>
        {round.questions.map((question) => {
          const questionDetails = round.game.game_questions.find(
            (q) => q.id === question.questionId
          )!;

          return (
            <QuestionItem
              key={question.questionId}
              askedAt={question.created_at}
              answer={question.answer}
              cost={questionDetails.cost}
              details={questionDetails.details}
              question={questionDetails.content}
              userRole="HIDER"
              questionId={question.questionId}
              askedBy={question.team.name}
              timeLimitToAnswerQuestion={round.game.answer_time_limit}
              ownerTeamId={question.team.id}
            />
          );
        })}
      </div>
      <CursesCard />
    </>
  );
}
