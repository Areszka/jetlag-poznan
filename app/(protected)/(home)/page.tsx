import { Suspense } from "react";
import { Questions } from "@/app/ui/questions/Questions";
import { Curses } from "@/app/ui/curses/Curses";
import Games from "@/app/ui/games";
import Card from "@/app/ui/components/card/card";
import { ButtonLink } from "@/app/ui/components/button/button";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import ListWrapper from "@/app/ui/components/ListWrapper/ListWrapper";
import PushNotificationManager from "@/app/ui/components/PushNotificationManager/PushNotificationManager";
import Footer from "@/app/ui/components/Footer/Footer";

export default function Page(): JSX.Element {
  return (
    <>
      <FlexWithGap gap={32}>
        <PushNotificationManager />
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
        <Footer />
      </FlexWithGap>
    </>
  );
}
