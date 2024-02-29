const express = require("express");
const postsController = require("../controllers/postController");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.post("/", checkAuth.checkAuth, postsController.save);
router.get("/", postsController.index);
router.get("/:id", postsController.show);
router.patch("/:id", checkAuth.checkAuth, postsController.update);
router.delete("/:id", checkAuth.checkAuth, postsController.destroy);

module.exports = router;
