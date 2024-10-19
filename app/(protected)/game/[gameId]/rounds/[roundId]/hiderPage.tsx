import Header from "@/app/ui/components/header/header";
import { HiderInfoCards } from "./InfoCards/InfoCards";
import GameControlButton from "./GameButtons/GameControlButton";
import TeamsSection from "./TeamsSection/TeamsSection";
import Questions from "./Questions";
import GameCursesCard from "./GameCursesCard";

export default function HiderPage() {
  return (
    <>
      <HiderInfoCards />
      <GameControlButton />
      <TeamsSection />
      <div>
        <Header>Asked Questions</Header>
        <Questions />
      </div>
      <GameCursesCard />
    </>
  );
}
