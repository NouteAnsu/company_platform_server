const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_TEST_DATABASE,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_PRODUCTION_DATABASE,
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    dialect: "mysql",
    logging: false,
    timezone: '+09:00',
    pool: {
      max: 20,
      min: 5,
      idle: 60000
    }
  }
}