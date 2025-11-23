import { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {},
  buildCommand: "npm run build",
  buildOutputPath: ".next",
  dangerous: {
    disableTagCache: false,
    disableIncrementalCache: false,
  },
};

export default config;