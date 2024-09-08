import { Role } from "@prisma/client";

type ChangeNameAction = {
  type: "name_changed";
  name: string;
};

type AddTeamAction = {
  type: "team_added";
  teamName: string;
};

type RemoveTeamAction = {
  type: "team_removed";
  teamName: string;
};

type AddMemberAction = {
  type: "member_added";
  teamName: string;
  member: string;
};

type RemoveMemberAction = {
  type: "member_removed";
  teamName: string;
  member: string;
};

type SetRoleAction = {
  type: "role_set";
  teamName: string;
  role: Role;
};

export type GameAction =
  | ChangeNameAction
  | AddTeamAction
  | RemoveTeamAction
  | AddMemberAction
  | RemoveMemberAction
  | SetRoleAction;

export interface GameState {
  name: string;
  teams: Team[];
  questionIds: string[];
  /**
   * Order of the curses matters as difficulty increases from 1 to n
   */
  curseIds: string[];
}

export type Team = {
  name: string;
  role: Role;
  membersUsernames: string[];
};

export default function reducer(game: GameState, action: GameAction) {
  switch (action.type) {
    case "name_changed": {
      return { ...game, name: action.name };
    }
    case "member_added": {
      const nextTeams = [...game.teams].map((team) => {
        if (team.name === action.teamName) {
          return {
            ...team,
            membersUsernames: [...team.membersUsernames, action.member],
          };
        }
        return team;
      });

      return { ...game, teams: nextTeams };
    }
    case "member_removed": {
      const nextTeams = [...game.teams].map((team) => {
        if (team.name === action.teamName) {
          const nextTeamMembers = [...team.membersUsernames].filter(
            (username) => username !== action.member,
          );
          return { ...team, membersUsernames: nextTeamMembers };
        }
        return team;
      });

      return { ...game, teams: nextTeams };
    }
    case "team_added": {
      const newTeam = {
        name: action.teamName,
        role: Role.HIDER,
        membersUsernames: [],
      };
      return { ...game, teams: [...game.teams, newTeam] };
    }
    case "team_removed": {
      const nextTeams = [...game.teams].filter(
        (team) => team.name !== action.teamName,
      );
      return { ...game, teams: nextTeams };
    }
    case "role_set": {
      const nextTeams = [...game.teams].map((team) => {
        if (team.name === action.teamName) {
          return { ...team, role: action.role };
        }
        return team;
      });
      return { ...game, teams: nextTeams };
    }
  }
}
