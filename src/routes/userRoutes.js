const express = require("express");
const {
  registerQuery,
  loginQuery,
  getLoggedInUser,
  editScore,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../queries/userQuery");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const token = await registerQuery(req.body);
    res.send(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const token = await loginQuery(req.body);
    res.send(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await getLoggedInUser(req.headers.authorization);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/me", authenticateToken, async (req, res) => {
  try {
    const { score } = req.body;
    const user = await editScore(req.headers.authorization, score);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getSingleUser(id);
    console.log("Fetched single user data:", user); //
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, portrait } = req.body;
    const user = await updateUser(id, username, password, portrait);
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

module.exports = router;
