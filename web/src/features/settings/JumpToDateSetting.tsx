import { getRouteApi } from "@tanstack/react-router";

import { AppDate, formatDateTime } from "@/atoms/dates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const routeApi = getRouteApi("/");
export function JumpToDateSetting() {
  const navigate = routeApi.useNavigate();
  const { date: dateRaw } = routeApi.useSearch();
  const date = dateRaw ? AppDate.fromUrlFriendly(dateRaw) : new AppDate();
  return (
    <Label className="flex items-center justify-between">
      Jump To Another Date:
      <Input
        type="datetime-local"
        className="w-fit"
        value={formatDateTime(date)}
        onChange={(e) => {
          void navigate({
            search: { date: new AppDate(e.target.value).toUrlFriendly() },
          });
        }}
      />
    </Label>
  );
}
