import { useApp } from "@/app/useApp";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function DateItemHeightSetting() {
  const {
    dateItemHeight,
    setDateItemHeight,
    minDateItemHeight,
    maxDateItemHeight,
  } = useApp();
  return (
    <>
      <Label>Zoom Level</Label>
      <Slider
        value={[dateItemHeight]}
        onValueChange={([newValue]) => {
          if (newValue) setDateItemHeight(newValue);
        }}
        min={minDateItemHeight}
        step={1}
        max={maxDateItemHeight}
      />
    </>
  );
}
