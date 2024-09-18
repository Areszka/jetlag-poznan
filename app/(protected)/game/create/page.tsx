"use client";

import { fetchWithBaseUrl } from "@/app/helpers";
import Card from "@/app/ui/components/card/card";
import { Game, Question, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { FormEvent, Reducer } from "react";
import styles from "./page.module.css";
import { MdOutlineErrorOutline } from "react-icons/md";
import reducer, { GameAction, GameState } from "./reducer";
import Teams, { InputWithAddButton, NameInput } from "./components";
import { PostGamesRequest, PostGamesResponse } from "@/app/api/games/route";

const INITIAL_SETTINGS: GameState = {
  name: "",
  teams: [],
  questionIds: [],
  curses: [],
};

export default function CreateGamePage() {
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [game, dispatch] = React.useReducer<Reducer<GameState, GameAction>>(
    reducer,
    INITIAL_SETTINGS
  );
  const [questions, setQuestions] = React.useState<Question[] | null>(null);
  React.useEffect(() => {
    setErrorMessage("");
  }, [game]);

  React.useEffect(() => {
    const getData = async () => {
      const questionsResponse = await fetchWithBaseUrl(`/api/questions`);
      const cursesResponse = await fetchWithBaseUrl(`/api/curses`);

      if (questionsResponse.ok) {
        const data = await questionsResponse.json();
        setQuestions(data.questions);
      }

      if (cursesResponse.ok) {
        const data = await cursesResponse.json();
        dispatch({ type: "curses_initialized", curses: data.curses });
      }
    };
    getData();
  }, []);

  const router = useRouter();

  async function createGame() {}

  async function handleSubmitForm(event: FormEvent<HTMLFormElement>) {
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
      name: game.name,
      questionIds: game.questionIds,
      teams: game.teams,
      curseIds: game.curses.map((curse) => curse.id),
      diceCost: Number(event.currentTarget.diceCost.value),
      answerTimeLimit,
      jailDuration,
    };

    const response = await fetchWithBaseUrl(`/api/games`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      setErrorMessage(response.statusText);
    } else {
      const data: PostGamesResponse = await response.json();
      router.push(`/game/${data.game.id}/rounds/${data.game.rounds[0].id}`);
    }
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
    const response = await fetchWithBaseUrl(`/api/users/${username}`);

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

  function moveCurseUp(curseId: string) {
    dispatch({ type: "curse_difficulty_decreased", curseId });
  }

  function moveCurseDown(curseId: string) {
    dispatch({ type: "curse_difficulty_increased", curseId });
  }

  return (
    <Card title="Create New Game">
      <form onSubmit={handleSubmitForm} className={styles.form}>
        <NameInput
          value={game.name}
          onChange={(name) => dispatch({ type: "name_changed", name })}
        />
        <label>
          {" "}
          Number of coins needed to roll one dice
          <input type="number" name="diceCost" defaultValue="50" required />
        </label>

        <label>
          {" "}
          Time limit for hiders to answer a question
          <input type="time" name="answerTimeLimit" min="00:10" defaultValue="00:15" required />
        </label>

        <label>
          {" "}
          Jail period (time seekers need to wait before starting their expedition)
          <input type="time" name="jailDuration" defaultValue="00:30" required />
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
          <legend>Choose questions</legend>
          {questions &&
            questions.map((question) => {
              return (
                <label key={question.id}>
                  <input
                    type="checkbox"
                    name="question"
                    checked={game.questionIds.includes(question.id)}
                    onChange={() => {
                      if (game.questionIds.includes(question.id)) {
                        dispatch({
                          type: "question_removed",
                          questionId: question.id,
                        });
                      } else {
                        dispatch({
                          type: "question_added",
                          questionId: question.id,
                        });
                      }
                    }}
                  />
                  {question.content}
                  <br />
                  Details: {question.details}
                </label>
              );
            })}
        </fieldset>

        <ol>
          {game.curses.map((curse) => {
            return (
              <li key={curse.id}>
                <button type="button" onClick={() => moveCurseUp(curse.id)}>
                  up
                </button>
                <button type="button" onClick={() => moveCurseDown(curse.id)}>
                  down
                </button>
                {curse.name}
              </li>
            );
          })}
        </ol>
        <button className={styles.createButton}>Create</button>
      </form>
      {errorMessage && (
        <div className={styles.error}>
          <MdOutlineErrorOutline /> {errorMessage}
        </div>
      )}
    </Card>
  );
}
