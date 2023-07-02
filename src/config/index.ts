/**
 * JS object conainig useful app-wide settings and vals
 */

const config = {
  port: Number(process.env.PORT || 3000),
  db: {
    mongo_url: process.env.MONGO_CONNECTION_STRING || ''
  }
}

export default config;