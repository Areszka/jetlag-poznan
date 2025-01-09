import Form from "@/app/ui/components/Form/Form";
import ListItemPlaceholder from "@/app/ui/components/ListItemPlaceholder/ListItemPlaceholder";

export default function Loading(): JSX.Element {
  return (
    <Form>
      <label>
        Game Name
        <ListItemPlaceholder />
      </label>
      <label>
        Dice Cost
        <ListItemPlaceholder />
      </label>
      <label>
        Answer Time Limit
        <ListItemPlaceholder />
      </label>
      <label>
        Seekers&apos; Jail Period
        <ListItemPlaceholder />
      </label>
      <label>
        Teams
        <ListItemPlaceholder />
      </label>
      <label>
        Questions
        <ListItemPlaceholder />
        <ListItemPlaceholder />
        <ListItemPlaceholder />
      </label>
      <label>
        Curses
        <ListItemPlaceholder />
        <ListItemPlaceholder />
        <ListItemPlaceholder />
      </label>
    </Form>
  );
}
