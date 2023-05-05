const router = require("express").Router();
const { createUser, login } = require("../controllers/userController");
 

router.post("/register", createUser);
router.post("/login", login);

module.exports = router;
