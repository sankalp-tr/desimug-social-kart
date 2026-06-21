const WallPost = require('../models/WallPost');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await WallPost.find()
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await WallPost.find({ author: req.params.userId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await WallPost.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { author, content, imageUrl, tags } = req.body;
    const post = await WallPost.create({ author, content, imageUrl, tags });
    await post.populate('author', 'name avatar');
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await WallPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const post = await WallPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: userId, text });
    await post.save();
    await post.populate('comments.user', 'name avatar');
    res.status(201).json(post.comments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await WallPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
