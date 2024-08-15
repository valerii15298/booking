import { formatDateTime } from "@/atoms/dates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function JumpToDateSetting() {
  return (
    <Label className="flex items-center justify-between">
      Jump To Date
      <Input
        type="datetime-local"
        className="w-fit"
        defaultValue={formatDateTime(new Date())}
        onChange={(e) => {
          // eslint-disable-next-line no-console
          console.log(new Date(e.target.value));
        }}
      />
    </Label>
  );
}
