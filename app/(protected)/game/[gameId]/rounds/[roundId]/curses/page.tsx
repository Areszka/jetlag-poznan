"use client";
import useUserTeam from "@/app/hooks/use_user_team";
import TeamsSection from "../components/TeamsSection/TeamsSection";
import Curses from "./Curses";

export default function Page() {
  const { userTeam } = useUserTeam();
  if (userTeam.role === "SEEKER") {
    return <Curses />;
  }
  return <TeamsSection />;
}
