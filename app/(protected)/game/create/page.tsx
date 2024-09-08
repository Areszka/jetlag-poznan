"use client";

import { fetchWithBaseUrl } from "@/app/helpers";
import Card from "@/app/ui/components/card/card";
import { Game, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { FormEvent, Reducer } from "react";
import styles from "./page.module.css";
import { MdOutlineErrorOutline } from "react-icons/md";
import reducer, { GameAction, GameState } from "./reducer";
import Teams, { InputWithAddButton, NameInput } from "./components";

const INITIAL_SETTINGS: GameState = { name: "", teams: [] };

export default function CreateGamePage() {
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [game, dispatch] = React.useReducer<Reducer<GameState, GameAction>>(
    reducer,
    INITIAL_SETTINGS
  );

  React.useEffect(() => {
    setErrorMessage("");
  }, [game]);

  const router = useRouter();

  async function createGame() {
    const response = await fetchWithBaseUrl(`/api/games`, {
      method: "POST",
      body: JSON.stringify(game),
    });

    if (!response.ok) {
      setErrorMessage(response.statusText);
    } else {
      const data: Game = await response.json();
      router.push(`/game/${data.id}`);
    }
  }

  function handleSubmitForm(event: FormEvent) {
    event.preventDefault();
    createGame();
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
      dispatch({ type: "member_added", member: username, teamName });
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

  function handleRemoveMember(teamName: string, username: string) {
    dispatch({ type: "member_removed", teamName, member: username });
  }

  return (
    <Card title="Create New Game">
      <form onSubmit={handleSubmitForm} className={styles.form}>
        <NameInput
          value={game.name}
          onChange={(name) => dispatch({ type: "name_changed", name })}
        />
        <InputWithAddButton label="Teams" onClick={handleAddTeam} />
        <Teams
          teams={game.teams}
          removeTeam={handleRemoveTeam}
          changeRole={handleChangeRole}
          addMember={handleAddMember}
          removeMember={handleRemoveMember}
        ></Teams>
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