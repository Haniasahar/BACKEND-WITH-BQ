import { Post } from "../models/post.models.js";

export const getAllProducts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "userName email")
      .sort("-createdAt");
    res.json(posts);
  } catch (err) {
    res.status(404).json({ message: "Posts not found" });
  }
};

export const createProduct = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      email:req.user.email,
      userName: req.user.userName,
    });

    const populatedPost = await Post.findById(post._id)
    .populate('author', 'userName email');

    res.status(201).json({ populatedPost, message: "Post created succcessfully" });
  } catch (error) {
    console.error("post creation error:", error);
    res.status(400).json({ message: "Post not created" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const likePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     // if (!post.likes) post.likes = []
    
//     const likedIndex = post.likes.indexOf(req.user._id.toString());
//     if (likedIndex === -1) {
//       post.likes.push(req.user._id);
//     } else {
//       post.likes.splice(likedIndex, 1);
//     }

//     await post.save();
//     res.json({post,message:"Post liked"});
//   } catch (err) {
//     console.error("Like error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const addComment = async (req, res) => {
//   const { comment } = req.body;

//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     post.comments.push({ comment, author: req.user._id });
//     await post.save();
//     res.json({post,message:"Commented Successfully"});
//   } catch (err) {
//     console.error("Comment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
