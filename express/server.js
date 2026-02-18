require("dotenv").config();
require("reflect-metadata");
const datasource = require("./db-config/data-source");
const app = require("./app");

const port = process.env.PORT || 3000;

datasource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
