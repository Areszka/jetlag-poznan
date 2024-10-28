import { Suspense } from "react";
import { Questions } from "../ui/questions/Questions";
import { Curses } from "../ui/curses/Curses";
import Games from "../ui/games";
import Card from "../ui/components/card/card";
import { ButtonLink } from "../ui/components/button/button";
import FlexWithGap from "../ui/components/FlexWithGap/FlexWithGap";
import ListWrapper from "../ui/components/ListWrapper/ListWrapper";
import PushNotificationManager from "./PushNotificationManager";
import Footer from "../ui/components/Footer/Footer";

export default function Page(): JSX.Element {
  return (
    <>
      <PushNotificationManager />
      <FlexWithGap gap={32}>
        <Card title="Games">
          <ButtonLink href={"/game/create"}>Create new Game</ButtonLink>
          <ListWrapper>
            <Suspense fallback={<p>Games are loading... </p>}>
              <Games />
            </Suspense>
          </ListWrapper>
        </Card>
        <Card title="Questions">
          <ButtonLink href="/questions/new">Add new question</ButtonLink>
          <ListWrapper>
            <Suspense fallback={<p>Questions are loading... </p>}>
              <Questions />
            </Suspense>
          </ListWrapper>
        </Card>
        <Card title="Curses">
          <ButtonLink href="/curses/new">Add new curse</ButtonLink>
          <ListWrapper>
            <Suspense fallback={<p>Curses are loading... </p>}>
              <Curses />
            </Suspense>
          </ListWrapper>
        </Card>
      </FlexWithGap>
      <Footer />
    </>
  );
}
