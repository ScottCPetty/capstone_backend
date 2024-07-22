require("dotenv").config();
const { app } = require("../src/shared/shared");
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`I am listening on port number ${PORT}`);
});

const userRoutes = require("../src/routes/userRoutes");
app.use("/api/user", userRoutes);
