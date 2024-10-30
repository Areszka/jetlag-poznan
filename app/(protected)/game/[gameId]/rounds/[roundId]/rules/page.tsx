import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import Winner from "../Winner";
import Header from "@/app/ui/components/header/header";
import GameCursesCard from "../GameCursesCard";
import AllTeamsSection from "../components/AllTeamsSection/AllTeamsSection";
import InfoCards from "../components/InfoCards/InfoCards";
import GameControlButton from "../components/GameButtons/GameControlButton";

export default function Page() {
  return (
    <FlexWithGap gap={32}>
      <InfoCards />
      <GameControlButton />
      <Winner />
      <div>
        <Header>List of avaible curses</Header>
        <GameCursesCard />
      </div>
      <AllTeamsSection />
    </FlexWithGap>
  );
}
