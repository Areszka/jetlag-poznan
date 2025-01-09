import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <FlexWithGap gap={32}>{children}</FlexWithGap>;
}
