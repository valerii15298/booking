import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

import { useApp } from "./app/useApp";

export function LoadPreviousNextButtons() {
  const { scrollableContainerRef, preload } = useApp();

  const loadNextRef = useRef<HTMLButtonElement>(null);
  const loadPreviousRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = scrollableContainerRef.current;
    const loadNext = loadNextRef.current;
    const loadPrevious = loadPreviousRef.current;
    if (!container) return;
    function onScroll() {
      if (!container || !loadNext || !loadPrevious) return;
      const previousNotVisible =
        container.scrollTop > loadPrevious.clientHeight;
      const nextNotVisible =
        container.scrollTop + container.clientHeight <
        container.scrollHeight - loadNext.clientHeight;
      if (previousNotVisible && nextNotVisible) return;

      const left = `${container.scrollLeft + container.clientWidth / 2}px`;
      loadPrevious.style.left = left;
      loadNext.style.left = left;
    }
    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [scrollableContainerRef]);

  return (
    <>
      <Button
        ref={loadPreviousRef}
        variant={"outline"}
        className="absolute left-1/2 top-2 z-20 translate-x-1/2"
        onClick={preload}
      >
        Load Previous
      </Button>
      <Button
        ref={loadNextRef}
        variant={"outline"}
        className="absolute bottom-2 left-[50%] z-20 translate-x-[-50%]"
        onClick={preload}
      >
        Load Next
      </Button>
    </>
  );
}
