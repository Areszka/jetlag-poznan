import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import Winner from "../Winner";
import Header from "@/app/ui/components/header/header";
import GameCursesCard from "../GameCursesCard";
import AllTeamsSection from "../components/AllTeamsSection/AllTeamsSection";
import InfoCards from "../components/InfoCards/InfoCards";
import { serverFetch } from "@/app/server-fetch";
import { GetRoundsResponse } from "@/app/api/games/[gameId]/rounds/route";
import Link from "next/link";
import TimeSpan from "../timeSpan";
import RemoveRoundButton from "../components/RemoveRoundButton/RemoveRoundButton";

export default function Page({ params }: { params: { gameId: string; roundId: string } }) {
  return (
    <FlexWithGap gap={32}>
      <Rounds params={params} />
      <InfoCards />
      <Winner />
      <div>
        <Header>List of avaible curses</Header>
        <GameCursesCard />
      </div>
      <AllTeamsSection />
      <RemoveRoundButton />
    </FlexWithGap>
  );
}

async function Rounds({ params }: { params: { gameId: string; roundId: string } }) {
  const response = await serverFetch(`/api/games/${params.gameId}/rounds`);

  if (!response.ok) {
    return <p>Error</p>;
  }

  const { rounds }: GetRoundsResponse = await response.json();

  return (
    <ol>
      {rounds.map((round, index) => (
        <li key={round.id}>
          <Link
            href={`/game/${params.gameId}/rounds/${round.id}`}
            style={{ fontWeight: `${round.id === params.roundId ? "900" : "400"}` }}
          >
            Round {index + 1}{" "}
            {round.start_time && round.end_time && (
              <TimeSpan startDate={round.start_time} endDate={round.end_time} />
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
