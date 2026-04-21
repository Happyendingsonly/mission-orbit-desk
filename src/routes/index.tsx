import { createFileRoute } from "@tanstack/react-router";
import { MissionControlGate } from "@/components/mission-control/MissionControlGate";
import { AuthProvider } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Mission Control · Happy Endings Inc" },
      {
        name: "description",
        content:
          "Operator console for AI agents — fleet status, pending decisions, and transmission log.",
      },
    ],
  }),
});

function Index() {
  return (
    <AuthProvider>
      <MissionControlGate />
    </AuthProvider>
  );
}
