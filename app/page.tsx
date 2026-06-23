import Petals from "./components/Petals";
import Invitation from "./components/Invitation";

export default function Home() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden">
      <Petals />
      <Invitation />
    </main>
  );
}
