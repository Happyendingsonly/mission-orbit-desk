import { createFileRoute } from "@tanstack/react-router";
import { MissionControl } from "@/components/mission-control/MissionControl";

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
  return <MissionControl />;
}
