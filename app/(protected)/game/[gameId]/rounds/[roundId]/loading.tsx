import Spinner from "@/app/ui/components/spinner/spinner";

export default async function Loading() {
  return (
    <div style={{ display: "grid", placeContent: "center", height: "100%" }}>
      <Spinner size="32px" color="#0f202e" />
    </div>
  );
}
