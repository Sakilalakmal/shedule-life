
import { requiredAuthUser } from "../lib/hook";

export default async function DashBoardPage() {
  const session = await requiredAuthUser();

  return (
    <div></div>
  );
}
