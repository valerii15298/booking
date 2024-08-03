import { createLazyFileRoute } from "@tanstack/react-router";

import { AssetsBookings } from "@/pages/Bookings";

function Index() {
  return <AssetsBookings />;
}

export const Route = createLazyFileRoute("/")({
  component: Index,
});
