import { getRouteApi } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import { useApp } from "../app/useApp";

const routeApi = getRouteApi("/");
export function GoToCurrentDateSetting({
  onGo,
}: {
  onGo: () => Promise<void>;
}) {
  const navigate = routeApi.useNavigate();
  const { rerender } = useApp();
  return (
    <Button
      onClick={() => {
        void onGo()
          .then(rerender)
          .then(async () => navigate({ search: {} }));
      }}
      className="flex-1"
      variant={"secondary"}
    >
      Go To Current Date
    </Button>
  );
}
