import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import connectDB from "./db/index.js";

import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config({
  path: "./.env",
});

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })

  .catch((error) => {
    console.error("Error connecting to the database:", error);
  })

  .finally(() => {
    console.log("Database connection attempt finished. Exiting...");
  });
