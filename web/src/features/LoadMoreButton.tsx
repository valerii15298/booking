import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { useApp } from "./app/useApp";

const SHIFT = 100;
export function LoadPreviousNextButtons() {
  const { scrollableContainerRef, preload } = useApp();

  const [previousVisible, setPreviousVisible] = useState(false);
  const [nextVisible, setNextVisible] = useState(false);

  useEffect(() => {
    const container = scrollableContainerRef.current;
    if (!container) return;
    function onScroll() {
      if (!container) return;
      setPreviousVisible(container.scrollTop < SHIFT);
      setNextVisible(
        container.scrollTop + container.clientHeight >
          container.scrollHeight - SHIFT,
      );
    }
    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [scrollableContainerRef]);

  if (!previousVisible && !nextVisible) return null;

  return (
    <Button
      variant={"outline"}
      className={`fixed left-1/2 z-20 -translate-x-1/2 ${previousVisible ? "top-1" : ""} ${nextVisible ? "bottom-1" : ""}`}
      onClick={preload}
    >
      Load More
    </Button>
  );
}
