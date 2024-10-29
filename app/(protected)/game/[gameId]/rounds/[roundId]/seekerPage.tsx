import Header from "@/app/ui/components/header/header";
import Curses from "./Curses";
import Questions from "./Questions";
import { SeekerInfoCards } from "./components/InfoCards/InfoCards";
import GameControlButton from "./components/GameButtons/GameControlButton";

export default function SeekerPage() {
  return (
    <>
      <SeekerInfoCards />
      <GameControlButton />
      <div>
        <Header>Curses</Header>
        <Curses />
      </div>
      <div>
        <Header>Questions</Header>
        <Questions />
      </div>
    </>
  );
}
