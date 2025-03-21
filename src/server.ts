import app from "./app";
import { syncDatabase } from "./util/sync-database";

const PORT = process.env.APP_PORT || 3000;

const startServer = async () => {
  await syncDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
