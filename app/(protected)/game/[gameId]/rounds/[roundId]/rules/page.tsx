import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import Winner from "../components/Winner";
import Header from "@/app/ui/components/header/header";
import GameCursesCard from "./GameCursesCard";
import AllTeamsSection from "../components/AllTeamsSection/AllTeamsSection";
import InfoCards from "../components/InfoCards/InfoCards";
import RemoveRoundButton from "../components/RemoveRoundButton/RemoveRoundButton";

export default function Page() {
  return (
    <FlexWithGap gap={32}>
      <InfoCards />
      <Winner />
      <div>
        <Header>Game curses</Header>
        <GameCursesCard />
      </div>
      <AllTeamsSection />
      <RemoveRoundButton />
    </FlexWithGap>
  );
}
