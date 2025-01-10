"use client";

import Header from "@/app/ui/components/header/header";
import Item from "@/app/ui/components/Item/Item";
import styles from "./AllTeamsSection.module.css";
import Tag from "@/app/ui/components/tag/tag";
import { useRoundContext } from "../RoundProvider";

export default function AllTeamsSection() {
  const { round } = useRoundContext();
  return (
    <>
      <div>
        <Header>Teams</Header>
        <div className={styles.teamsWrapper}>
          {round.teams.map((team) => {
            return (
              <Item key={team.id}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p
                    style={{ paddingBlockStart: " 4px" }}
                  >{`${team.name} (${team.members.map((m) => m.username).join(", ")})`}</p>
                  <Tag hue={team.role === "SEEKER" ? 90 : 30}>{team.role}</Tag>
                </div>
              </Item>
            );
          })}
        </div>
      </div>
    </>
  );
}
