import { createLazyFileRoute } from "@tanstack/react-router";

import { trpc } from "@/trpc";

function CreateBooking() {
  const utils = trpc.useUtils();
  const create = trpc.assets.create.useMutation({
    onSuccess: async () => utils.assets.list.invalidate(),
  });
  return (
    <button
      disabled={create.isPending}
      onClick={() => {
        create.mutate({ name: "My asset" });
      }}
    >
      Create booking
    </button>
  );
}

function Index() {
  const bookings = trpc.assets.list.useQuery();
  if (bookings.isPending) {
    return <>Loading...</>;
  }
  if (bookings.isError) {
    return <>{bookings.error.message}</>;
  }
  return (
    <>
      <CreateBooking />
      <pre>{JSON.stringify(bookings.data, null, 2)}</pre>
    </>
  );
}

export const Route = createLazyFileRoute("/")({
  component: Index,
});
