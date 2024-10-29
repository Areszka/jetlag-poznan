"use client";

import useCountdown from "@/app/hooks/use-countdown";
import Item from "@/app/ui/components/Item/Item";

export default function TeamCurseWrapper({
  children,
  vetoedAt,
  curseIsActive,
}: {
  children: JSX.Element;
  vetoedAt: Date | null;
  curseIsActive: boolean;
}) {
  if (curseIsActive) {
    return <Item style="red">{children}</Item>;
  }

  return <Wrapper vetoedAt={vetoedAt}>{children}</Wrapper>;
}

function Wrapper({ children, vetoedAt }: { children: JSX.Element; vetoedAt: Date | null }) {
  const timeLeftVeto = useCountdown({
    startTime: vetoedAt ?? new Date(),
    period: 1000 * 60 * 15,
  });

  if (vetoedAt && timeLeftVeto !== null && timeLeftVeto > 0) {
    return <Item style="red">{children}</Item>;
  }
  return <Item>{children}</Item>;
}
