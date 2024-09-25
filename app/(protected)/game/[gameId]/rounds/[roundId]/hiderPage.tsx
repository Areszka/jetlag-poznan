import Header from "@/app/ui/components/header/header";
import { HiderInfoCards } from "./InfoCards/InfoCards";
import GameControlButton from "./GameButtons/GameControlButton";
import TeamsSection from "./TeamsSection/TeamsSection";
import Questions from "./Questions";
import CursesCard from "./cursesCard";

export default function HiderPage() {
  return (
    <>
      <HiderInfoCards />
      <GameControlButton />
      <TeamsSection />
      <div>
        <Header>Questions</Header>
        <Questions />
      </div>
      <CursesCard />
    </>
  );
}
