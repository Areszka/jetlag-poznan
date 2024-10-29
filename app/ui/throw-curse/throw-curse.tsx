"use client";

import { fetchWithBaseUrl } from "@/app/helpers";
import React from "react";
import styles from "./throw-curse.module.css";
import { CgDice1, CgDice2, CgDice3, CgDice4, CgDice5, CgDice6 } from "react-icons/cg";

import DiceControls from "./dice-controls";
import { useRouter } from "next/navigation";
import { Button } from "../components/button/button";
import { useRoundContext } from "@/app/(protected)/game/[gameId]/rounds/[roundId]/TeamProvider";
import { sendNotification } from "@/app/utils/actions";
import { ThrowCurseResponse } from "@/app/api/curses/throw/[targetTeamId]/[numberOfDice]/route";

const diceComponents = {
  1: CgDice1,
  2: CgDice2,
  3: CgDice3,
  4: CgDice4,
  5: CgDice5,
  6: CgDice6,
};

type Dots = 1 | 2 | 3 | 4 | 5 | 6;

export default function ThrowCurse({ teamId }: { teamId: string }) {
  const [isLoading, setIsLoading] = React.useState<Boolean>(false);
  const [dice, setDice] = React.useState<Array<Dots>>([3]);
  const router = useRouter();

  const { round } = useRoundContext();
  const costPerDice = round.game.dice_cost;
  const coins = round.teams.find((team) => team.teamId === teamId)!.coins;

  const MaxNumberOfDiceTeamCanAfford = Math.floor(coins / costPerDice);

  function increaseNumberOfDice() {
    if (dice.length < MaxNumberOfDiceTeamCanAfford) {
      const numberOnDice = (Math.floor(Math.random() * 6) + 1) as Dots;
      setDice([...dice, numberOnDice]);
    } else {
      alert("Not enough money to increase number of dice");
    }
  }

  function decreaseNumberOfDice() {
    if (dice.length === 1) return;
    const nextDices = [...dice];
    nextDices.pop();

    setDice(nextDices);
  }

  return (
    <>
      <div className={styles.buttonsWrapper}>
        <div className={styles.diceWrapper}>
          {dice.map((value, index) => {
            const DiceIcon = diceComponents[value];
            return <DiceIcon key={index} />;
          })}
        </div>
        <DiceControls addDice={increaseNumberOfDice} removeDice={decreaseNumberOfDice} />

        <Button
          disabled={dice.length <= 0}
          onClick={async () => {
            if (dice.length < 1) {
              alert("You need to roll at least one dice");
              return;
            }
            if (dice.length > MaxNumberOfDiceTeamCanAfford) {
              alert(`You can't afford to roll ${dice.length} dice`);
              return;
            }

            setIsLoading(true);

            const response = await fetchWithBaseUrl(`/api/curses/throw/${teamId}/${dice.length}`, {
              method: "POST",
            });

            if (response.ok) {
              const data: ThrowCurseResponse = await response.json();
              router.refresh();

              const cursedTeam = round.teams.find((team) => team.teamId === teamId);

              await sendNotification(
                `You've been cursed!`,
                data.curse.curse.name,
                cursedTeam?.members.map((member) => member.id)!
              );

              const otherSeekers = round.teams
                .filter((team) => team.teamId !== teamId && team.role === "SEEKER")
                .flatMap((team) => team.members.map((m) => m.id));

              await sendNotification(
                `${cursedTeam?.name} has been cursed!`,
                data.curse.curse.name,
                otherSeekers!
              );

              setDice(data.dice as Dots[]);
              setIsLoading(false);
            }
          }}
        >
          Roll next curse
        </Button>
      </div>
    </>
  );
}
