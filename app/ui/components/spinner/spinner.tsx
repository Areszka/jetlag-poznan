import React from "react";
import { ImSpinner8 } from "react-icons/im";

import styles from "./Spinner.module.css";

const Spinner = ({ color, size }: { color?: string; size?: string }) => {
  return (
    <div className={styles.wrapper}>
      <ImSpinner8 color={color} size={size} />
    </div>
  );
};

export default Spinner;
