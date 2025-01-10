"use client";

import useUserTeam from "@/app/hooks/use_user_team";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import ListItemPlaceholder from "@/app/ui/components/ListItemPlaceholder/ListItemPlaceholder";
import TeamCardLoader from "../components/TeamsSection/TeamCardLoader";

export default function PageLoader() {
  const { userTeam } = useUserTeam();

  if (userTeam.role === "SEEKER") {
    return (
      <FlexWithGap>
        <ListItemPlaceholder />
        <ListItemPlaceholder />
      </FlexWithGap>
    );
  }

  return <TeamCardLoader />;
}
