import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    console.log("Connected to the database");
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`⚙️ Server is running at port: ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("Database connection failed!!!", err);
  });
