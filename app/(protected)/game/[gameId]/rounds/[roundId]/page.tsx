import { serverFetch } from "@/app/server-fetch";
import { GetRoundResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/route";
import { validateSession } from "@/app/api/auth";
import HiderPage from "./hiderPage";
import SeekerPage from "./seekerPage";
import TeamProvider from "./TeamProvider";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import PollingWrapper from "./WrapperPolling";
import Winner from "./Winner";
import Header from "@/app/ui/components/header/header";
import GameCursesCard from "./GameCursesCard";
import AllTeamsSection from "./AllTeamsSection/AllTeamsSection";

export default async function Page({ params }: { params: { gameId: string; roundId: string } }) {
  const userId = await validateSession();

  const response = await serverFetch(`/api/games/${params.gameId}/rounds/${params.roundId}`);

  if (!response.ok) {
    return <p>Error</p>;
  }

  const data: GetRoundResponse = await response.json();
  const round = data.round;

  const userTeam = round.teams.find((team) => team.members.some(({ id }) => id === userId));

  return (
    <TeamProvider userId={userId} round={round}>
      <PollingWrapper>
        <FlexWithGap gap={32}>
          <Winner />
          {userTeam!.role === "HIDER" ? <HiderPage /> : <SeekerPage />}
          <div>
            <Header>List of avaible curses</Header>
            <GameCursesCard />
          </div>
          <AllTeamsSection />
        </FlexWithGap>
      </PollingWrapper>
    </TeamProvider>
  );
}
