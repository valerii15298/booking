import { createLazyFileRoute } from "@tanstack/react-router";

import { AssetsBookings } from "@/Bookings";

function Index() {
  return <AssetsBookings />;
}

export const Route = createLazyFileRoute("/")({
  component: Index,
});
