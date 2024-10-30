import { useRoundContext } from "../(protected)/game/[gameId]/rounds/[roundId]/RoundProvider";

export default function useHidersIds() {
  const { round } = useRoundContext();

  const hidersIds = round.teams
    .find((team) => team.role === "HIDER")
    ?.members.map((member) => member.id);

  return { hidersIds };
}
