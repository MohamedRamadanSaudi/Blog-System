const express = require("express");
const commentController = require("../controllers/commentController");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.post("/", checkAuth.checkAuth, commentController.save);
router.get("/", checkAuth.checkAuth, commentController.index);
router.get("/:id", checkAuth.checkAuth, commentController.show);
router.patch("/:id", checkAuth.checkAuth, commentController.update);
router.delete("/:id", checkAuth.checkAuth, commentController.destroy);

module.exports = router;
