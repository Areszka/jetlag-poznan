import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { gameId: string; roundId: string } }) {
  redirect(`/game/${params.gameId}/rounds/${params.roundId}/rules`);
}
