import Invitation from "./components/Invitation";

export default function Home() {
  return (
    <main className="relative min-h-dvh w-full overflow-x-clip">
      {/* Invitation renders the 3D WebGL background + the scrolling journey */}
      <Invitation />
    </main>
  );
}
