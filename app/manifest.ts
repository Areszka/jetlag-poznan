import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jet Lag Poznań",
    description:
      "Jet Lag Poznań is an app to host hide & seek games inspired by Jet Lag: The Game. Use curses, timers, and in-game questions to play across the city.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
  };
}
