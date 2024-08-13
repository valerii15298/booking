import { CubeIcon } from "@radix-ui/react-icons";

export const loading = (
  <div className="grid h-full w-full place-items-center overflow-hidden">
    <CubeIcon
      className={`h-[50%] w-[50%] animate-spin`}
      style={{ animationDuration: "3s" }}
    />
  </div>
);
