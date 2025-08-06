import { Router } from "express";
import {
  getAllPosts,
  createPost,
  deletePost,
  likePost,
  addComment,
} from "../controllers/post.controllers.js";
import { verifyJWT } from "../middlewares/auth.mw.js";
import { getAllUsers } from "../controllers/auth.controllers.js";

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.post("/", verifyJWT, createPost);
postRouter.delete("/:id", verifyJWT, deletePost);
postRouter.post("/:id/like", verifyJWT, likePost);
postRouter.post("/:id/comment", verifyJWT, addComment);
postRouter.get("/users", verifyJWT, getAllUsers);

export default postRouter;
