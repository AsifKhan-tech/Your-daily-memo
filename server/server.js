import "dotenv/config";

import app from "./src/app.js";
import databaseConnection from "./src/common/config/db.connection.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  //connect to database
  await databaseConnection(); //code wait until the db operation complete

  app.listen(PORT, () => {
    console.log(
      `Server is listen on port: http://localhost:${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });
};

start().catch((e) => {
  console.error("Failed to start server", e);
  process.exit(1);
});
