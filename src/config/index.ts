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
    origin: process.env.FRONT_END_URL
  },
  positiveAdjectives,
  positiveNouns
}

export default config;