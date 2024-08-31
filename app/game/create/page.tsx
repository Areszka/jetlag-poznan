"use client";
import { getBaseUrl } from "@/app/helpers";
import { useRouter } from "next/navigation";
import React from "react";

type Role = "seeker" | "hider";

type GameSettings = {
  name: string;
  teams: { name: string; role: Role }[];
  players: Player[];
};

type Player = { email: string; team: string };

const INITIAL_SETTINGS = {
  name: "",
  teams: [],
  players: [],
};

export default function CreateGamePage() {
  const [game, setGame] = React.useState<GameSettings>(INITIAL_SETTINGS);

  const router = useRouter();

  function handleChangeTeam(email: string, newTeam: string) {
    const nextPlayers = [...game.players].map((oldPlayer) =>
      oldPlayer.email === email ? { ...oldPlayer, team: newTeam } : oldPlayer
    );
    setGame({ ...game, players: nextPlayers });
  }

  function handleRemovePlayer(email: string) {
    const nextPlayers = [...game.players].filter((player) => player.email !== email);
    setGame({ ...game, players: nextPlayers });
  }
  function createGame() {
    /*
        const response = await fetch(`${getBaseUrl()}/api/games`, {
          method: "POST",
          body: JSON.stringify(game),
        });

        if (!response.ok) {
          console.info("ERRROWOWOROR");
        } else {
          router.push("/game");
        }
          */
  }

  return (
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
      <AddInput
        label="Teams"
        buttonLabel="Add"
        onClick={(team) =>
          setGame({ ...game, teams: [...game.teams, { name: team, role: "seeker" }] })
        }
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
              onChangeRole={() => {
                const nextTeams = [...game.teams].map((oldTeam) =>
                  oldTeam.name === team.name
                    ? { ...team, role: team.role === "seeker" ? "hider" : ("seeker" as Role) }
                    : oldTeam
                );
                setGame({ ...game, teams: nextTeams });
              }}
            />
          );
        })}
      </ul>

      <AddInput
        label="Players"
        buttonLabel="Add"
        onClick={(email) =>
          setGame({
            ...game,
            players: [...game.players, { email: email, team: game.teams[0].name }],
          })
        }
      />
      <Players
        players={game.players}
        teams={game.teams.map((team) => team.name)}
        changeTeam={handleChangeTeam}
        removePlayer={handleRemovePlayer}
      />
      <button>Create</button>
    </form>
  );
}

function AddInput({
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
}: {
  name: string;
  onRemoveClick: (name: string) => void;
  onChangeRole: (name: string) => void;
}) {
  return (
    <li>
      {name}
      <select onChange={(event) => onChangeRole(event.target.value as Role)}>
        <option value="seeker">Seeker</option>
        <option value="hider">Hider</option>
      </select>
      <button type="button" onClick={() => onRemoveClick(name)}>
        Remove
      </button>
    </li>
  );
}

function Players({
  players,
  changeTeam,
  removePlayer,
  teams,
}: {
  players: Player[];
  teams: string[];
  changeTeam: (email: string, newTeam: string) => void;
  removePlayer: (email: string) => void;
}) {
  return (
    <ul>
      {players.map((player) => {
        return (
          <li key={player.email}>
            {player.email}
            <select
              value={player.team}
              onChange={(event) => changeTeam(player.email, event.target.value)}
            >
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => removePlayer(player.email)}>
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}
