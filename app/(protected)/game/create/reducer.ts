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
  curseIds: string[];
};

type IncreaseDifficultyAction = {
  type: "curse_difficulty_increased";
  curseId: string;
};

type DecreaseDifficultyAction = {
  type: "curse_difficulty_decreased";
  curseId: string;
};

type AddAllQuestionsAction = {
  type: "all_questions_added";
  questionIds: string[];
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
  | IncreaseDifficultyAction
  | DecreaseDifficultyAction
  | AddAllQuestionsAction;

export interface GameState {
  teams: Team[];
  questionIds: string[];
  /**
   * Order of the throw-curse matters as difficulty increases from 1 to n
   */
  curseIds: string[];
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
      return { ...game, curseIds: action.curseIds };
    }
    case "curse_difficulty_decreased": {
      let nextCurseIds = [...game.curseIds];
      const curseIndex = nextCurseIds.findIndex((curseId) => curseId === action.curseId);

      if (curseIndex < 1) {
        return game;
      }

      nextCurseIds[curseIndex] = game.curseIds[curseIndex - 1];
      nextCurseIds[curseIndex - 1] = game.curseIds[curseIndex];

      return { ...game, curseIds: nextCurseIds };
    }
    case "curse_difficulty_increased": {
      let nextCurseIds = [...game.curseIds];
      const curseIndex = nextCurseIds.findIndex((curseId) => curseId === action.curseId);

      if (curseIndex === game.curseIds.length - 1) {
        return game;
      }

      nextCurseIds[curseIndex] = game.curseIds[curseIndex + 1];
      nextCurseIds[curseIndex + 1] = game.curseIds[curseIndex];

      return { ...game, curseIds: nextCurseIds };
    }
  }
}
