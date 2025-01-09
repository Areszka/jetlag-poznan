import Header from "@/app/ui/components/header/header";
import { InfoCardsPlaceholder } from "../components/InfoCards/InfoCards";
import ListItemPlaceholder from "@/app/ui/components/ListItemPlaceholder/ListItemPlaceholder";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";

export default function Loading() {
  return (
    <>
      <InfoCardsPlaceholder />
      <div>
        <Header>Game curses</Header>
        <FlexWithGap gap={12}>
          <ListItemPlaceholder />
          <ListItemPlaceholder />
        </FlexWithGap>
      </div>
      <div>
        <Header>Teams</Header>
        <FlexWithGap gap={12} flexDirection="row">
          <div style={{ flexGrow: 1 }}>
            <ListItemPlaceholder />
          </div>
          <div style={{ flexGrow: 1 }}>
            <ListItemPlaceholder />
          </div>
        </FlexWithGap>
      </div>
    </>
  );
}
