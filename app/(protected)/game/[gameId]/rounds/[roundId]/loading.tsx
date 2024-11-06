import Spinner from "@/app/ui/components/spinner/spinner";

export default async function Loading() {
  return (
    <div style={{ display: "grid", placeContent: "center", height: "calc(100vh - 57px - 76px)" }}>
      <Spinner size="32px" color="#0f202e" />
    </div>
  );
}
