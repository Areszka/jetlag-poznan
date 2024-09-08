import { Curse, Role } from "@prisma/client";

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
  user: User;
};

type RemoveMemberAction = {
  type: "member_removed";
  teamName: string;
  userId: string;
};

type SetRoleAction = {
  type: "role_set";
  teamName: string;
  role: Role;
};

type RemoveQuestionAction = {
  type: "question_removed";
  questionId: string;
};

type AddQuestionAction = {
  type: "question_added";
  questionId: string;
};

type InitializeCursesAction = {
  type: "curses_initialized";
  curses: Curse[];
};

type IncreaseDifficultyAction = {
  type: "curse_difficulty_increased";
  curseId: string;
};

type DecreaseDifficultyAction = {
  type: "curse_difficulty_decreased";
  curseId: string;
};

export type GameAction =
  | ChangeNameAction
  | AddTeamAction
  | RemoveTeamAction
  | AddMemberAction
  | RemoveMemberAction
  | SetRoleAction
  | AddQuestionAction
  | RemoveQuestionAction
  | InitializeCursesAction
  | IncreaseDifficultyAction
  | DecreaseDifficultyAction;

export interface GameState {
  name: string;
  teams: Team[];
  questionIds: string[];
  /**
   * Order of the throw-curse matters as difficulty increases from 1 to n
   */
  curses: Curse[];
}

export type Team = {
  name: string;
  role: Role;
  members: User[];
};

export type User = { id: string; username: string };
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
            members: [...team.members, action.user],
          };
        }
        return team;
      });

      return { ...game, teams: nextTeams };
    }
    case "member_removed": {
      const nextTeams = [...game.teams].map((team) => {
        if (team.name === action.teamName) {
          const nextTeamMembers = [...team.members].filter(({ id }) => id !== action.userId);
          return { ...team, members: nextTeamMembers };
        }
        return team;
      });

      return { ...game, teams: nextTeams };
    }
    case "team_added": {
      const newTeam: Team = {
        name: action.teamName,
        role: Role.HIDER,
        members: [],
      };
      return { ...game, teams: [...game.teams, newTeam] };
    }
    case "team_removed": {
      const nextTeams = [...game.teams].filter((team) => team.name !== action.teamName);
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
    case "question_added": {
      return { ...game, questionIds: [...game.questionIds, action.questionId] };
    }
    case "question_removed": {
      const nextQuestionIds = [...game.questionIds].filter(
        (questionId) => questionId !== action.questionId
      );

      return { ...game, questionIds: nextQuestionIds };
    }
    case "curses_initialized": {
      return { ...game, curses: action.curses };
    }
    case "curse_difficulty_decreased": {
      let nextCurses = [...game.curses];
      const curseIndex = nextCurses.findIndex((curse) => curse.id === action.curseId);

      if (curseIndex < 1) {
        return game;
      }

      nextCurses[curseIndex] = game.curses[curseIndex - 1];
      nextCurses[curseIndex - 1] = game.curses[curseIndex];

      return { ...game, curses: nextCurses };
    }
    case "curse_difficulty_increased": {
      let nextCurses = [...game.curses];
      const curseIndex = nextCurses.findIndex((curse) => curse.id === action.curseId);

      if (curseIndex === game.curses.length - 1) {
        return game;
      }

      nextCurses[curseIndex] = game.curses[curseIndex + 1];
      nextCurses[curseIndex + 1] = game.curses[curseIndex];

      return { ...game, curses: nextCurses };
    }
  }
}
