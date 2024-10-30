import Spinner from "@/app/ui/components/spinner/spinner";

export default async function Loading() {
  return (
    <div style={{ display: "grid", placeContent: "center" }}>
      <Spinner />
    </div>
  );
}
