import { serverFetch } from "@/app/server-fetch";
import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import { validateSession } from "@/app/api/auth";
import HiderPage from "./hiderPage";
import SummaryPage from "./summaryPage";
import SeekerPage from "./seekerPage";

export default async function Page({ params }: { params: { gameId: string; roundId: string } }) {
  const userId = await validateSession();
  const response = await serverFetch(`/api/games/${params.gameId}/rounds/${params.roundId}`);

  if (!response.ok) {
    return <p>Error</p>;
  }

  const data: GetRoundResponse = await response.json();

  if (data.round.end_time) {
    return <SummaryPage response={data} />;
  }

  if (
    data.round.teams
      .find((team) => team.role === "HIDER")
      ?.team.members.some((member) => member.id === userId)
  ) {
    return <HiderPage response={data} />;
  }

  return <SeekerPage response={data} />;
}
