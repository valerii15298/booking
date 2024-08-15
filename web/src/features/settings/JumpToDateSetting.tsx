import { getRouteApi } from "@tanstack/react-router";

import { dateFromISO, dateToISO, formatDateTime } from "@/atoms/dates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const routeApi = getRouteApi("/");
export function JumpToDateSetting() {
  const navigate = routeApi.useNavigate();
  const { date: dateRaw } = routeApi.useSearch();
  const date = dateRaw ? new Date(dateToISO(dateRaw)) : new Date();
  return (
    <Label className="flex items-center justify-between">
      Jump To Date
      <Input
        type="datetime-local"
        className="w-fit"
        value={formatDateTime(date)}
        onChange={(e) => {
          void navigate({
            search: {
              date: dateFromISO(new Date(e.target.value).toISOString()),
            },
          });
        }}
      />
    </Label>
  );
}
