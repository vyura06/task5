const Router = require('express');
const router = new Router();
const userController = require("../controllers/user.controller");

router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser);
router.get("/users/:id/messages/", userController.getUserMessages);
router.get("/users/:id/messages/:message_id", userController.getMessage);
router.post("/users/:receiver_id/messages/", userController.sendMessage);

module.exports = router;