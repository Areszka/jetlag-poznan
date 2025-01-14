import { redirect } from "next/navigation";

export default function Page({ params }: { params: { gameId: string; roundId: string } }) {
  redirect(`/game/${params.gameId}/rounds/${params.roundId}/rules`);
}
