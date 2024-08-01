const { bcrypt, prisma, jwt, uuid } = require("../shared/shared");

const registerQuery = async ({ username, password, isAdmin, portrait }) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const registerUser = await prisma.user.create({
      data: {
        username,
        password: hashPassword,
        isAdmin,
        portrait,
      },
    });
    const token = jwt.sign(
      {
        id: registerUser.id,
      },
      process.env.WEB_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    return token;
  } catch (error) {
    throw new Error("Error registering user: " + error.message);
  }
};

const loginQuery = async ({ username, password }) => {
  const loginUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!loginUser) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, loginUser.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    {
      id: loginUser.id,
    },
    process.env.WEB_TOKEN,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const getLoggedInUser = async (header) => {
  const token = header?.split(" ")[1];
  let id = "";
  try {
    const payload = await jwt.verify(token, process.env.WEB_TOKEN);
    id = payload.id;
  } catch (ex) {
    const error = Error("Not Authorized");
    error.status = 404;
    throw error;
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

const editScore = async (header, score) => {
  const token = header?.split(" ")[1];
  let id = "";
  try {
    const payload = await jwt.verify(token, process.env.WEB_TOKEN);
    id = payload.id;
  } catch (ex) {
    const error = Error("Not Authorized");
    error.status = 404;
    throw error;
  }
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      score,
    },
  });
  return user;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getSingleUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

const updateUser = async (id, username, password, portrait) => {
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
        password: hashPassword,
        portrait,
      },
    });
    console.log("Updated user:", user); //
    return user;
  } catch (error) {
    console.error("Error updating user in database:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return user;
};

module.exports = {
  registerQuery,
  loginQuery,
  getLoggedInUser,
  editScore,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
