"use client";

import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { FormEvent, Reducer } from "react";
import styles from "./page.module.css";
import reducer, { GameAction, GameState } from "./reducer";
import { PostGamesRequest, PostGamesResponse } from "@/app/api/games/route";
import Form from "@/app/ui/components/Form/Form";
import CardError from "@/app/ui/components/card/CardError";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";
import QuestionsInput from "./components/QuestionsInput";
import { fetcherPost } from "@/app/helpers";
import InputWithAddButton from "./components/InputWithAddButton";
import Teams from "./components/Teams";
import CursesInput from "./components/CursesInput";

const INITIAL_SETTINGS: GameState = {
  teams: [],
  questionIds: [],
  curses: [],
  cursesCosts: [10, 30, 50],
};

export default function CreateGamePage() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [game, dispatch] = React.useReducer<Reducer<GameState, GameAction>>(
    reducer,
    INITIAL_SETTINGS
  );

  React.useEffect(() => {
    setErrorMessage("");
  }, [game]);

  const { trigger, isMutating, error } = useSWRMutation(
    `/api/games`,
    fetcherPost<PostGamesRequest>
  );

  function toggleQuestion(questionId: string) {
    if (game.questionIds.includes(questionId)) {
      dispatch({ type: "question_removed", questionId });
    } else {
      dispatch({ type: "question_added", questionId });
    }
  }

  function initializeQuestions(questionIds: string[]) {
    dispatch({ type: "all_questions_added", questionIds });
  }

  function initializeCurses(curses: { id: string; difficulty: number }[]) {
    dispatch({ type: "curses_initialized", curses });
  }

  function handleAddTeam(teamName: string) {
    if (game.teams.some((team) => team.name === teamName)) {
      setErrorMessage(`There already is team named ${teamName}`);
      return false;
    } else {
      dispatch({ type: "team_added", teamName });
      return true;
    }
  }

  async function handleAddMember(teamName: string, username: string) {
    const response = await fetch(`/api/users/${username}`);

    if (response.ok) {
      const { user } = await response.json();
      dispatch({ type: "member_added", user, teamName });
      return true;
    } else {
      setErrorMessage(response.statusText);
      return false;
    }
  }

  function handleRemoveTeam(teamName: string) {
    dispatch({ type: "team_removed", teamName: teamName });
  }

  function handleChangeRole(teamName: string, role: Role) {
    dispatch({ type: "role_set", teamName, role });
  }

  function handleRemoveMember(teamName: string, userId: string) {
    dispatch({ type: "member_removed", teamName, userId });
  }

  function changeCurseDifficulty(curseId: string, difficulty: number) {
    dispatch({ type: "curse_difficulty_changed", curseId, difficulty });
  }

  function handleSubmitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const inputJailDuration: string = event.currentTarget.jailDuration.value;
    const jailHours = Number(inputJailDuration.split(":")[0]);
    const jailMinutes = Number(inputJailDuration.split(":")[1]);

    const jailDuration = 1000 * 60 * jailMinutes + 1000 * 60 * 60 * jailHours;

    const inputAnswerTimeLimit: string = event.currentTarget.answerTimeLimit.value;
    const answerLimitHours = Number(inputAnswerTimeLimit.split(":")[0]);
    const answerLimitMinutes = Number(inputAnswerTimeLimit.split(":")[1]);

    const answerTimeLimit = 1000 * 60 * answerLimitMinutes + 1000 * 60 * 60 * answerLimitHours;

    const requestData: PostGamesRequest = {
      name: event.currentTarget.gameName.value,
      questionIds: game.questionIds,
      teams: game.teams,
      curses: game.curses,
      answerTimeLimit,
      jailDuration,
      curse_costs: game.cursesCosts,
    };

    trigger(requestData).then(({ game }: PostGamesResponse) =>
      router.push(`/game/${game.id}/rounds/${game.rounds[0].id}`)
    );
  }

  return (
    <>
      <Form onSubmit={handleSubmitForm}>
        <label>
          Game Name
          <input type="text" name="gameName" required />
        </label>

        <label>
          Answer Time Limit
          <input type="time" name="answerTimeLimit" min="00:01" defaultValue="00:15" required />
        </label>

        <label>
          Seekers&apos; Jail Period
          <input type="time" name="jailDuration" min="00:01" defaultValue="00:30" required />
        </label>

        <InputWithAddButton label="Teams" onClick={handleAddTeam} />
        <Teams
          teams={game.teams}
          removeTeam={handleRemoveTeam}
          changeRole={handleChangeRole}
          addMember={handleAddMember}
          removeMember={handleRemoveMember}
        ></Teams>
        <fieldset>
          <legend>Questions</legend>
          <QuestionsInput
            questionIds={game.questionIds}
            toggleQuestion={toggleQuestion}
            initializeQuestions={initializeQuestions}
          />
        </fieldset>

        <fieldset>
          <legend>Curse Costs</legend>
          <label>
            Curses of difficulty 1
            <input
              type="number"
              name="curseCost1"
              defaultValue={game.cursesCosts[0]}
              onChange={(e) => {
                dispatch({
                  type: "curse_costs_updated",
                  curseDifficulty: 1,
                  curseCost: Number(e.target.value),
                });
              }}
            />
          </label>
          <label>
            Curses of difficulty 2
            <input
              type="number"
              name="curseCost2"
              defaultValue={game.cursesCosts[1]}
              onChange={(e) => {
                dispatch({
                  type: "curse_costs_updated",
                  curseDifficulty: 2,
                  curseCost: Number(e.target.value),
                });
              }}
            />
          </label>
          <label>
            Curses of difficulty 3
            <input
              type="number"
              name="curseCost3"
              defaultValue={game.cursesCosts[2]}
              onChange={(e) => {
                dispatch({
                  type: "curse_costs_updated",
                  curseDifficulty: 3,
                  curseCost: Number(e.target.value),
                });
              }}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Curses</legend>
          <CursesInput
            curses={game.curses}
            changeCurseDifficulty={changeCurseDifficulty}
            initializeCurses={initializeCurses}
          />
        </fieldset>
        <button className={styles.createButton} disabled={isMutating}>
          {isMutating ? <Spinner color="gray" /> : "Create"}
        </button>
      </Form>
      {errorMessage && <CardError>{errorMessage}</CardError>}
      {error && <CardError>{error.message}</CardError>}
    </>
  );
}
