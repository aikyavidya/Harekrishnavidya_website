'use client';

import { useEffect } from "react";

const UTMTracker = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get("utm_source");
    const utm_medium = params.get("utm_medium");
    const utm_campaign = params.get("utm_campaign");

    if (utm_source || utm_medium || utm_campaign) {
      localStorage.setItem("utm_source", utm_source || "");
      localStorage.setItem("utm_medium", utm_medium || "");
      localStorage.setItem("utm_campaign", utm_campaign || "");
    }
  }, []);

  return null; // This component just runs the effect
};

export default UTMTracker;
