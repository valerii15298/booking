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
      <span>Jump To Date:</span>
      <Input
        step={0.001}
        type="datetime-local"
        className="w-fit"
        value={formatDateTime(date).split(".")[0]} // TODO move formatDateTime to a util/AppDate class
        onChange={(e) => {
          void navigate({
            search: { date: new AppDate(e.target.value).toUrlFriendly() },
          });
        }}
      />
    </Label>
  );
}
