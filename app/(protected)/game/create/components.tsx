import { MdDeleteOutline } from "react-icons/md";
import styles from "./page.module.css";
import { Team } from "./reducer";
import { Role } from "@prisma/client";
import React, { ReactNode } from "react";
import Spinner from "@/app/ui/components/spinner/spinner";

export function NameInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string) => void;
}) {
  return (
    <label>
      Game name
      <input required value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default function Teams({
  teams,
  removeTeam,
  changeRole,
  addMember,
  removeMember,
}: {
  teams: Team[];
  removeTeam: (name: string) => void;
  changeRole: (teamName: string, role: Role) => void;
  addMember: (teamName: string, username: string) => boolean | Promise<boolean>;
  removeMember: (teamName: string, username: string) => void;
}) {
  return (
    <ul>
      {teams.map((team) => {
        return (
          <TeamItem
            key={team.name}
            name={team.name}
            onRemoveClick={() => removeTeam(team.name)}
            onChangeRole={(role) => changeRole(team.name, role)}
          >
            <InputWithAddButton
              label="Team members"
              onClick={async (username: string) => await addMember(team.name, username)}
            />
            <Members
              members={team.membersUsernames}
              deleteMember={(username) => removeMember(team.name, username)}
            />
          </TeamItem>
        );
      })}
    </ul>
  );
}

function TeamItem({
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
    <li className={styles.teamCard}>
      <div className={styles.teamHeaderWrapper}>
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
        <DeleteButton onClick={() => onRemoveClick(name)} />
      </div>
      {children}
    </li>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button className={styles.removeButton} type="button" onClick={onClick}>
      <MdDeleteOutline />
    </button>
  );
}

export function InputWithAddButton({
  label,
  onClick,
}: {
  onClick: (value: string) => boolean | Promise<boolean>;
  label: string;
}) {
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <label>
      {label}
      <div className={styles.addInputWrapper}>
        <input value={input} onChange={(event) => setInput(event.target.value)} />
        <button
          type="button"
          onClick={async () => {
            if (input) {
              setIsLoading(true);
              const success = await onClick(input);
              if (success) setInput("");
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? <Spinner /> : "Add"}
        </button>
      </div>
    </label>
  );
}

function Members({
  members,
  deleteMember,
}: {
  members: string[];
  deleteMember: (username: string) => void;
}) {
  return (
    <ul className={styles.players}>
      {members.map((username) => {
        return (
          <li key={username}>
            {username}
            <DeleteButton onClick={() => deleteMember(username)} />
          </li>
        );
      })}
    </ul>
  );
}
