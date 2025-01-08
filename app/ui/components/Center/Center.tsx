import { ReactNode } from "react";

export default function Center({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", placeContent: "center", height: "100%" }}>{children}</div>;
}
