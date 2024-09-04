"use client";

import { fetchWithBaseUrl } from "@/app/helpers";
import Card from "../components/card/card";
import React from "react";
import styles from "./curses.module.css";
import { Text } from "../components/text/text";
import { LuDices } from "react-icons/lu";
import {
  CgDice1,
  CgDice2,
  CgDice3,
  CgDice4,
  CgDice5,
  CgDice6,
} from "react-icons/cg";
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
  const [dice, setDice] = React.useState<Array<Dots>>([1, 4]);

  return (
    <Card title="Cube">
      <div className={styles.wrapper}>
        <div className={styles.textWrapper}>
          {data === null && !isLoading && (
            <Text type="title">No curse yet. Roll the dice!</Text>
          )}
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
            {isLoading ? (
              <p>?</p>
            ) : (
              dice.map((value, index) => {
                const DiceIcon = diceComponents[value];
                return isLoading ? (
                  <p key={index}>?</p>
                ) : (
                  <DiceIcon key={index} />
                );
              })
            )}
          </div>

          <div className={styles.diceButtons}>
            <button
              onClick={() => {
                const nextDices = [...dice];
                nextDices.pop();

                setDice(nextDices);
              }}
            >
              <IoIosArrowDown />
            </button>
            <p>{dice.length}</p>
            <button
              onClick={() => {
                const numberOnDice = (Math.floor(Math.random() * 6) +
                  1) as Dots;
                setDice([...dice, numberOnDice]);
              }}
            >
              <IoIosArrowUp />
            </button>
          </div>

          <button
            disabled={dice.length <= 0}
            onClick={async () => {
              setIsLoading(true);
              if (dice.length > 0) {
                const teamId = ""; //TODO: add teamId
                const response = await fetchWithBaseUrl(
                  `/api/curses/throw/${teamId}/${dice.length}`,
                );

                if (response.ok) {
                  const parsedResponse = await response.json();
                  setData(parsedResponse.curse);
                  setDice(parsedResponse.dice);
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
