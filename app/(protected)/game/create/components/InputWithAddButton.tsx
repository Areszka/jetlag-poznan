import styles from "../page.module.css";
import React from "react";
import Spinner from "@/app/ui/components/spinner/spinner";

export default function InputWithAddButton({
  label,
  onClick,
}: {
  onClick: (value: string) => boolean | Promise<boolean>;
  label: string;
}) {
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <label>
      {label}
      <div className={styles.addInputWrapper}>
        <input value={input} onChange={(event) => setInput(event.target.value)} />
        <button
          type="button"
          onClick={async () => {
            if (input) {
              setIsLoading(true);
              const success = await onClick(input);
              if (success) setInput("");
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? <Spinner /> : "Add"}
        </button>
      </div>
    </label>
  );
}
