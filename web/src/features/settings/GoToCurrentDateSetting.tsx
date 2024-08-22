import { getRouteApi } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

const routeApi = getRouteApi("/");
export function GoToCurrentDateSetting({ onGo }: { onGo?: () => void }) {
  const navigate = routeApi.useNavigate();
  return (
    <Button
      onClick={() => {
        onGo?.();
        void navigate({ search: {} });
      }}
      className="flex-1"
      variant={"secondary"}
    >
      Go To Current Date
    </Button>
  );
}
