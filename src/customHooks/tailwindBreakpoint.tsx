import { useEffect, useState } from "react";
import { useWindowSize } from "./windowSize";

const useTailwindBreakpoint = () => {
  const { width } = useWindowSize();
  const [TWBreakpoint, setTWBreakpoint] = useState<string | undefined>("");
  useEffect(() => {
    setTWBreakpoint(getBreakpoint(width));
  }, [width]);

  const getBreakpoint = (width: number) => {
    if (width <= 640) {
      return "sm";
    } else if (width > 640 && width <= 768) {
      return "md";
    } else if (width > 768 && width <= 1024) {
      return "lg";
    } else if (width > 1024 && width <= 1280) {
      return "xl";
    } else if (width > 1280) {
      return "2xl";
    }
    return "md";
  };

  return {
    breakpoint: TWBreakpoint,
  };
};

export default useTailwindBreakpoint;
