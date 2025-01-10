import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import ListItemPlaceholder from "@/app/ui/components/ListItemPlaceholder/ListItemPlaceholder";

export default function Loader() {
  return (
    <FlexWithGap>
      <ListItemPlaceholder height="60px" />
      <ListItemPlaceholder height="40px" />
      <ListItemPlaceholder height="50px" />
    </FlexWithGap>
  );
}
