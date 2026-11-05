"use client";

import { useEffect } from "react";
import { trackFunnelEvent } from "@/lib/funnel-analytics";

export function PageView() {
  useEffect(() => {
    trackFunnelEvent("LandingPageView");
  }, []);
  return null;
}
