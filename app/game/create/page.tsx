"use client";
import { getBaseUrl } from "@/app/helpers";
import { Game, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

export type GameSettings = {
  name: string;
  teams: { name: string; role: Role; playersUsernames: string[] }[];
};

const INITIAL_SETTINGS = {
  name: "",
  teams: [],
};

export default function CreateGamePage() {
  const [game, setGame] = React.useState<GameSettings>(INITIAL_SETTINGS);
  const [error, setError] = React.useState<string>("");

  const router = useRouter();

  async function createGame() {
    const response = await fetch(`${getBaseUrl()}/api/games`, {
      method: "POST",
      body: JSON.stringify(game),
    });

    if (!response.ok) {
      if (response.status === 500) {
        setError(response.statusText);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } else {
      const data: Game = await response.json();
      router.push(`/game/${data.id}`);
    }
  }

  return (
    <>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          createGame();
        }}
      >
        <label>
          Game name
          <input
            required
            value={game.name}
            onChange={(event) => setGame({ ...game, name: event.target.value })}
          />
        </label>
        <AddTeamInput
          label="Teams"
          buttonLabel="Add"
          onClick={(teamName) => {
            if (game.teams.some((team) => team.name === teamName)) {
              setError(`There already is team named ${teamName}`);
            } else {
              const newTeam = { name: teamName, role: Role.SEEKER, playersUsernames: [] };
              setGame({ ...game, teams: [...game.teams, newTeam] });
            }
          }}
        />

        <ul>
          {game.teams.map((team) => {
            return (
              <Team
                key={team.name}
                name={team.name}
                onRemoveClick={() => {
                  const nextTeams = [...game.teams].filter((val) => val.name !== team.name);
                  setGame({ ...game, teams: nextTeams });
                }}
                onChangeRole={(newRole: Role) => {
                  const nextTeams = [...game.teams].map((oldTeam) =>
                    oldTeam.name === team.name ? { ...team, role: newRole } : oldTeam
                  );
                  setGame({ ...game, teams: nextTeams });
                }}
              >
                <AddTeamInput
                  label="Players"
                  buttonLabel="Add"
                  onClick={(username) => {
                    const nextTeams = [...game.teams].map((t) => {
                      if (t.name === team.name) {
                        return { ...t, playersUsernames: [...t.playersUsernames, username] };
                      }

                      return t;
                    });
                    setGame({ ...game, teams: nextTeams });
                  }}
                />
                <ul>
                  {team.playersUsernames.map((username) => {
                    return (
                      <li key={username}>
                        {username}
                        <button
                          type="button"
                          onClick={() => {
                            const nextTeams = [...game.teams].map((t) => {
                              if (t.name === team.name) {
                                const nextUserNames = [...t.playersUsernames].filter(
                                  (val) => val !== username
                                );
                                return { ...t, playersUsernames: nextUserNames };
                              }

                              return t;
                            });
                            setGame({ ...game, teams: nextTeams });
                          }}
                        >
                          Remove
                        </button>{" "}
                      </li>
                    );
                  })}
                </ul>
              </Team>
            );
          })}
        </ul>

        <button>Create</button>
      </form>
      {error && <h1>{error}</h1>}
    </>
  );
}

function AddTeamInput({
  label,
  buttonLabel,
  onClick,
}: {
  onClick?: (value: string) => void;
  label: string;
  buttonLabel: string;
}) {
  const [input, setInput] = React.useState("");

  return (
    <>
      <label>
        {label}
        <input value={input} onChange={(event) => setInput(event.target.value)} />
      </label>

      {onClick && (
        <button
          type="button"
          onClick={() => {
            if (input) {
              onClick(input);
              setInput("");
            } else {
            }
          }}
        >
          {buttonLabel}
        </button>
      )}
    </>
  );
}

function Team({
  name,
  onRemoveClick,
  onChangeRole,
  children,
}: {
  name: string;
  children: ReactNode;
  onRemoveClick: (name: string) => void;
  onChangeRole: (role: Role) => void;
}) {
  return (
    <li>
      {name}
      <select onChange={(event) => onChangeRole(event.target.value as Role)}>
        {Object.keys(Role).map((role) => {
          return (
            <option key={role} value={role}>
              {role}
            </option>
          );
        })}
      </select>
      <button type="button" onClick={() => onRemoveClick(name)}>
        Remove
      </button>
      <br></br>
      {children}
    </li>
  );
}
