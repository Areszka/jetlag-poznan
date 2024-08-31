"use client";

import { getBaseUrl } from "@/app/helpers";
import Card from "../components/card/card";
import React from "react";
import styles from "./curses.module.css";
import { Text } from "../components/text/text";
import { LuDices } from "react-icons/lu";
import { CgDice1, CgDice2, CgDice3, CgDice4, CgDice5, CgDice6 } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const diceComponents = {
  1: CgDice1,
  2: CgDice2,
  3: CgDice3,
  4: CgDice4,
  5: CgDice5,
  6: CgDice6,
};

type CurseType = {
  id: number;
  name: string;
  effect: string;
};

type Dots = 1 | 2 | 3 | 4 | 5 | 6;

export default function Curses() {
  const [data, setData] = React.useState<CurseType | null>(null);
  const [isLoading, setIsLoading] = React.useState<Boolean>(false);
  const [dices, setDices] = React.useState<Array<Dots>>([1, 4]);

  return (
    <Card title="Cube">
      <div className={styles.wrapper}>
        <div className={styles.textWrapper}>
          {data === null && !isLoading && <Text type="title">No curse yet. Roll the dice!</Text>}
          {isLoading && "Loading Curse.."}
          {data && !isLoading && (
            <>
              <Text type="title">{data.name}</Text>
              <Text type="description">{data.effect}</Text>
            </>
          )}
        </div>
        <div className={styles.buttonsWrapper}>
          <div className={styles.diceWrapper}>
            {dices.map((value, index) => {
              const DiceIcon = diceComponents[value];
              if (isLoading) {
                return <span>?</span>;
              }
              return <DiceIcon key={index} />;
            })}
          </div>

          <div className={styles.diceButtons}>
            <button
              onClick={() => {
                const nextDices = [...dices];
                nextDices.pop();

                setDices(nextDices);
              }}
            >
              <IoIosArrowDown />
            </button>
            <p>{dices.length}</p>
            <button
              onClick={() => {
                const numberOnDice = (Math.floor(Math.random() * 6) + 1) as Dots;
                setDices([...dices, numberOnDice]);
              }}
            >
              <IoIosArrowUp />
            </button>
          </div>

          <button
            disabled={dices.length <= 0}
            onClick={async () => {
              setIsLoading(true);
              if (dices.length > 0) {
                const response = await fetch(`${getBaseUrl()}/api/curses/${dices.length}`);

                if (response.ok) {
                  const parsedResponse = await response.json();
                  setData(parsedResponse.curse);
                  setDices(parsedResponse.dices);
                  setIsLoading(false);
                }
              }
            }}
          >
            <LuDices />
            Roll the dice
          </button>
        </div>
      </div>
    </Card>
  );
}