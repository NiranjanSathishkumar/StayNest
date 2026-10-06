if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
