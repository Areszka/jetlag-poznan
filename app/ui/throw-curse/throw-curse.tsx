"use client";

import { fetcherPost } from "@/app/helpers";
import React from "react";
import styles from "./throw-curse.module.css";
import { CgDice1, CgDice2, CgDice3, CgDice4, CgDice5, CgDice6 } from "react-icons/cg";

import DiceControls from "./dice-controls";
import { useParams } from "next/navigation";
import { Button } from "../components/button/button";
import { ThrowCurseResponse } from "@/app/api/curses/throw/[targetTeamId]/[numberOfDice]/route";
import { useGameContext } from "@/app/(protected)/game/[gameId]/rounds/[roundId]/GameProvider";
import useSWRMutation from "swr/mutation";
import Spinner from "../components/spinner/spinner";
import { useSWRConfig } from "swr";

const diceComponents = {
  1: CgDice1,
  2: CgDice2,
  3: CgDice3,
  4: CgDice4,
  5: CgDice5,
  6: CgDice6,
};

type Dots = 1 | 2 | 3 | 4 | 5 | 6;

export default function ThrowCurse({ teamId, coins }: { teamId: string; coins: number }) {
  const [dice, setDice] = React.useState<Array<Dots>>([3]);
  const { game } = useGameContext();
  const { mutate } = useSWRConfig();
  const params = useParams();
  const costPerDice = game.dice_cost;

  const MaxNumberOfDiceTeamCanAfford = Math.floor(coins / costPerDice);

  const { trigger, isMutating } = useSWRMutation<ThrowCurseResponse, Error, any, any>(
    `/api/curses/throw/${teamId}/${dice.length}`,
    fetcherPost
  );

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
          disabled={dice.length <= 0 || isMutating}
          onClick={async () => {
            if (dice.length < 1) {
              alert("You need to roll at least one dice");
              return;
            }
            if (dice.length > MaxNumberOfDiceTeamCanAfford) {
              alert(`You can't afford to roll ${dice.length} dice`);
              return;
            }

            trigger().then((data) => {
              mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/curses`);
              setDice(data.dice as Dots[]);
            });
          }}
        >
          {isMutating ? <Spinner /> : "Roll next curse"}
        </Button>
      </div>
    </>
  );
}
