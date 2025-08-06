// Task 2: User Registration System (Day 3)
// Objective: Work with POST requests and store user data in a .json file.
// Description:
//  Create a simple API where users can register with their name, email, and password.
// POST a new user.
// GET all registered users (without passwords exposed).
// GET a specific user by email (avoid exposing the password).
// DELETE a user by email.

import express from "express";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/users", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to post users file" });
    }
    let NewUsers = JSON.parse(data);
    NewUsers = NewUsers.map(({ password, ...rest }) => rest);

    NewUsers.push(req.body);

    const usertobeAdded = JSON.stringify(NewUsers);

    fs.writeFile("users.json", usertobeAdded, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to post users file" });
      }
    });

    res.json({
      success: true,
      message: "user data posted successfully",
      data: NewUsers,
    });
  });
});

app.get("/users", (req, res) => {
  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read users file" });
    }
    let users = JSON.parse(data);
    // Remove password field from each user
    users = users.map(({ password, ...rest }) => rest);
    res.json(users);
  });
});

app.get("/users/:email", (req, res) => {
  const userEmail = req.params.email;

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read users file" });
    }
    let users = JSON.parse(data);
    const user = users.find((p) => p.email === userEmail);
    if (user) {
      // Remove password field from the found user
      const { password, ...userWithoutPassword } = user;
      res.json({
        success: true,
        message: `User with email ${userEmail} fetched successfully`,
        data: userWithoutPassword,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

app.delete("/users/:email", (req, res) => {
  const userEmail = req.params.email;

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read users file" });
    }
    let users = JSON.parse(data);
    const userIndex = users.findIndex((p) => p.email === userEmail);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to delete users file" });
        }
        // Remove password field from each user before sending response
        const userWithoutPassword = users.map(({ password, ...rest }) => rest);
        res.json({
          success: true,
          message: `user with email ${userEmail} deleted successfully`,
          data: userWithoutPassword,
        });
      });
    } else {
      res.status(404).json({ error: "user not found" });
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on port http://localhost:${process.env.PORT || 3000}`
  );
});
