import Header from "@/app/ui/components/header/header";
import Questions from "./Questions";
import { HiderInfoCards } from "./components/InfoCards/InfoCards";
import GameControlButton from "./components/GameButtons/GameControlButton";
import TeamsSection from "./components/TeamsSection/TeamsSection";

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
    </>
  );
}
