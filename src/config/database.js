require('dotenv').config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
})

let ssl = process.env.NODE_ENV === "production" ? { require: true, rejectUnauthorized: false } : ""

module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || "postgres",
  dialectOptions: {
    ssl: ssl
  },
  operatorsAliase: false,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
