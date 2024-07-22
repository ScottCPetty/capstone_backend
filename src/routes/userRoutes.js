const express = require("express");
const { register, login } = require("../controllers/userControllers");
const {
  getAllUser,
  updateUser,
  deleteUser,
  getSingleUser,
} = require("../queries/userQuery");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Secure the getAllUser route with the authentication middleware
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const users = await getAllUser();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getSingleUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    const user = await updateUser(id, username, password);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
