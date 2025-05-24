import { Role } from "@prisma/client";

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
  curses: { id: string; difficulty: number }[];
};

type ChangeDifficultyAction = {
  type: "curse_difficulty_changed";
  curseId: string;
  difficulty: number;
};

type AddAllQuestionsAction = {
  type: "all_questions_added";
  questionIds: string[];
};

type UpdateCurseCostAction = {
  type: "curse_costs_updated";
  curseDifficulty: number;
  curseCost: number;
};

export type GameAction =
  | AddTeamAction
  | RemoveTeamAction
  | AddMemberAction
  | RemoveMemberAction
  | SetRoleAction
  | AddQuestionAction
  | RemoveQuestionAction
  | InitializeCursesAction
  | ChangeDifficultyAction
  | AddAllQuestionsAction
  | UpdateCurseCostAction;

export interface GameState {
  teams: Team[];
  questionIds: string[];
  curses: { id: string; difficulty: number }[];
  cursesCosts: number[];
}

export type Team = {
  name: string;
  role: Role;
  members: User[];
};

export type User = { id: string; username: string };

export default function reducer(game: GameState, action: GameAction) {
  switch (action.type) {
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
    case "all_questions_added": {
      return { ...game, questionIds: action.questionIds };
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

    case "curse_difficulty_changed": {
      let nextCurses = [...game.curses];
      const curseIndex = nextCurses.findIndex((curse) => curse.id === action.curseId);

      nextCurses[curseIndex] = { ...nextCurses[curseIndex], difficulty: action.difficulty };

      return { ...game, curses: nextCurses };
    }
    case "curse_costs_updated": {
      const nextCursesCosts = [...game.cursesCosts];
      nextCursesCosts[action.curseDifficulty - 1] = action.curseCost;
      return { ...game, cursesCosts: nextCursesCosts };
    }
  }
}
