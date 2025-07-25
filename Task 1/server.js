import express from "express";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

const app = express();
app.use(express.json());

// let tasks = [
//     { id: 1, title: 'Buy groceries',desc:"Milk,Bread,Eggs", completed: false },
//     { id: 2, title: 'Walk the dog',desc:"Around the block for 30 minutes", completed: true },
//     { id: 3, title: 'Do laundry',desc:"with ariel ariel hoho", completed: false }
// ];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/api/tasks", (req, res) => {
//   res.json(tasks);
// });

app.get("/api/tasks", (req, res) => {
  fs.readFile("tasks.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read tasks file" });
    }
    const tasks = JSON.parse(data);
    res.json(tasks);
  });
});

// app.get("/api/tasks/:id", (req, res) => {
//   const taskId = parseInt(req.params.id, 10);
//   const taskIndex = tasks.findIndex((s) => s.id === taskId);
//   if (taskIndex !== -1) {
//     // Ensure the id remains unchanged
//     tasks[taskIndex] = {
//       ...tasks[taskIndex],
//       id: taskId,
//     };
//     res.json({
//       success: true,
//       message: `Task with id ${taskId} recieved successfully`,
//       data: tasks[taskIndex],
//     });
//   } else {
//     res.status(404).json({ error: "Task not found" });
//   }
// });

app.get("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  fs.readFile("tasks.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read tasks file" });
    }
    const tasks = JSON.parse(data);
    const task = tasks.find((p) => p.id === taskId);
    if (task) {
      res.json({
        success: true,
        message: `task with id ${taskId} fetched successfully`,
        data: task,
      });
    } else {
      res.status(404).json({ error: "task not found" });
    }
  });
});

// app.post("/api/tasks", (req, res) => {
//   tasks.push(req.body);
//   res.json({
//     success: true,
//     message: "Task data posted successfullyyyy",
//     data: tasks,
//   });task

app.post("/api/tasks", (req, res) => {
  fs.readFile("tasks.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to post tasks file" });
    }
    const NewTasks = JSON.parse(data);
    NewTasks.push(req.body);

    const tasktobeAdded = JSON.stringify(NewTasks);

    fs.writeFile("tasks.json", tasktobeAdded, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to post tasks file" });
      }
    });

    res.json({
      success: true,
      message: "Task data posted successfully",
      data: NewTasks,
    });
  });
});

// app.put("/api/tasks/:id", (req, res) => {
//   const taskId = parseInt(req.params.id, 10);
//   const taskIndex = tasks.findIndex((s) => s.id === taskId);
//   if (taskIndex !== -1) {
//     tasks[taskIndex] = {
//     //   ...tasks[taskIndex],
//     ...req.body,
//       id: taskId,
//     };
//     res.json({
//       success: true,
//       message: `Task with id ${taskId} updated successfully`,
//       data: tasks[taskIndex],
//     });
//   } else {
//     res.status(404).json({ error: "Task not found" });
//   }
// });

app.put("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  fs.readFile("tasks.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read tasks file" });
    }
    const tasks = JSON.parse(data);
    const taskIndex = tasks.findIndex((p) => p.id === taskId);
    if (taskIndex !== -1) {
      // Update the task and ensure the id remains unchanged
      // tasks[taskIndex] = { ...tasks[taskIndex], ...req.body, id: taskId };
      tasks[taskIndex] = { ...req.body, id: taskId };
      fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to write to tasks file" });
        }
        res.json({
          success: true,
          message: `task with id ${taskId} updated successfully`,
          data: tasks[taskIndex],
        });
      });
    } else {
      res.status(404).json({ error: "task not found" });
    }
  });
});

// app.patch("/api/tasks/:id", (req, res) => {
//   const taskId = parseInt(req.params.id, 10);
//   const taskIndex = tasks.findIndex((s) => s.id === taskId);
//   if (taskIndex !== -1) {
//     tasks[taskIndex] = {
//       ...tasks[taskIndex],
//     ...req.body,
//       id: taskId,
//     };
//     res.json({
//       success: true,
//       message: `Task with id ${taskId} patched successfully`,
//       data: tasks[taskIndex],
//     });
//   } else {
//     res.status(404).json({ error: "Task not found" });
//   }
// });

app.patch("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  fs.readFile("tasks.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read tasks file" });
    }
    const tasks = JSON.parse(data);
    const taskIndex = tasks.findIndex((p) => p.id === taskId);
    if (taskIndex !== -1) {
      // Update the task and ensure the id remains unchanged
      tasks[taskIndex] = { ...tasks[taskIndex], ...req.body, id: taskId };
      fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to write to tasks file" });
        }
        res.json({
          success: true,
          message: `task with id ${taskId} patched successfully`,
          data: tasks[taskIndex],
        });
      });
    } else {
      res.status(404).json({ error: "task not found" });
    }
  });
});

// app.delete("/api/tasks/:id", (req, res) => {
//   const taskId = parseInt(req.params.id, 10);
//   const taskIndex = tasks.findIndex((s) => s.id === taskId);
//   if (taskIndex !== -1) {
//    tasks.splice(taskIndex, 1);
//     res.json({
//       success: true,
//       message: `Task with id ${taskId} deleted successfully`,
//       data: tasks,
//     });
//   } else {
//     res.status(404).json({ error: "Task not found. plz try again" });
//   }
// });

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  fs.readFile("tasks.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read tasks file" });
    }
    const tasks = JSON.parse(data);
    const taskIndex = tasks.findIndex((p) => p.id === taskId);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to delete tasks file" });
        }
        res.json({
          success: true,
          message: `task with id ${taskId} deleted successfully`,
          data: tasks,
        });
      });
    } else {
      res.status(404).json({ error: "task not found" });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;
