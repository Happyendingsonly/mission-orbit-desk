import { createFileRoute } from "@tanstack/react-router";

// TEMPORARY — delete after copying the key.
// Returns the service role key so the operator can configure reflect.py on the Mac Mini.
export const Route = createFileRoute("/api/_reveal-service-key")({
  server: {
    handlers: {
      GET: async () => {
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!key) {
          return new Response(
            JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
        return new Response(JSON.stringify({ serviceRoleKey: key }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
