import { positiveAdjectives } from "./positive-adjectives";
import { positiveNouns } from "./positive-nouns";

/**
 * JS object conainig useful app-wide settings and vals
 */
const config = {
  port: Number(process.env.PORT || 3000),
  db: {
    mongo_url: process.env.MONGO_CONNECTION_STRING || ''
  },
  corsOptions: {
    origin: `http://${process.env.LOCAL_URL_PREFIX}:8081`
  },
  positiveAdjectives,
  positiveNouns
}

export default config;