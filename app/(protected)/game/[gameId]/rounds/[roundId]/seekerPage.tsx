import Header from "@/app/ui/components/header/header";
import { SeekerInfoCards } from "./InfoCards/InfoCards";
import GameControlButton from "./GameButtons/GameControlButton";
import Curses from "./Curses";
import Questions from "./Questions";

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
