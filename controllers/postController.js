const validators = require("fastest-validator");
const models = require("../models");

function save(req, res) {
  const post = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
    categoryId: req.body.categoryId,
    userId: req.userData.userId,
  };

  const schema = {
    title: { type: "string", optional: false, max: 100 },
    content: { type: "string", optional: false, max: 500 },
    categoryId: { type: "number", optional: false },
  };

  const v = new validators();
  const validationResult = v.validate(post, schema);
  if (validationResult !== true) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: validationResult });
  }

  models.Category.findByPk(post.categoryId)
    .then((category) => {
      if (category !== null) {
        models.Post.create(post)
          .then((createdPost) => {
            res.status(201).json({
              message: "Post created successfully",
              post: createdPost,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "Error creating post",
              error: err,
            });
          });
      } else {
        res.status(404).json({
          message: "Category not found",
        });
      }
    })
    .catch((err) => {
      // Handle any errors from findByPk method
      res.status(500).json({
        message: "Error finding category",
        error: err,
      });
    });
}

function show(req, res) {
  const id = req.params.id;

  models.Post.findByPk(id, {
    include: [models.Category, models.User, models.Comment],
  })
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: "Post not found",
        });
        return;
      }
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error finding post",
        error: err,
      });
    });
}

function index(req, res) {
  models.Post.findAll()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error finding posts",
        error: err,
      });
    });
}

function update(req, res) {
  const id = req.params.id;
  const updatedPost = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
    categoryId: req.body.categoryId,
  };

  const userId = req.userData.userId;

  const schema = {
    title: { type: "string", optional: false, max: 100 },
    content: { type: "string", optional: false, max: 500 },
    categoryId: { type: "number", optional: false },
  };

  const v = new validators(); // Assuming validators is a valid validation library
  const validationResult = v.validate(updatedPost, schema);
  if (validationResult !== true) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: validationResult });
  }

  // Check if the provided categoryId exists in the Category model
  models.Category.findByPk(updatedPost.categoryId)
    .then((result) => {
      if (result !== null) {
        // If category exists, update the post
        models.Post.update(updatedPost, { where: { id: id, userId: userId } })
          .then((result) => {
            res.status(200).json({
              message: "Post updated successfully",
              post: updatedPost,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Something went wrong",
              error: error,
            });
          });
      } else {
        // If category doesn't exist, return error
        res.status(400).json({
          message: "Invalid Category ID",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error finding category",
        error: error,
      });
    });
}

function destroy(req, res) {
  const id = req.params.id;
  const userId = req.userData.userId;
  models.Post.destroy({
    where: {
      id: id,
      userId: userId,
    },
  })
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: "Post not found",
        });
        return;
      }
      res.status(200).json({
        message: "Post deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error deleting post",
        error: err,
      });
    });
}

module.exports = {
  save,
  show,
  index,
  update,
  destroy,
};
