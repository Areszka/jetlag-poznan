import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("jetlag_session");
  return redirect("/login");
}
