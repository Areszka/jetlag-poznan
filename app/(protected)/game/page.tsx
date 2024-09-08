import { fetchWithBaseUrl } from "../../helpers";

export default async function Page() {
  const response = await fetchWithBaseUrl(`/api/games`);

  if (!response.ok) {
    return <p>Error game</p>;
  }

  const data = await response.json();

  return <h1>{JSON.stringify(data)}</h1>;
}
