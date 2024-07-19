const { bcrypt, prisma, jwt, uuid } = require("../shared/shared");

const registerQuery = async ({ firstName, lastName, email, password }) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const registerUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashPassword,
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
};

// login function
const loginQuery = async ({ email, password }) => {
  //search user by email
  const loginUser = await prisma.user.findUnique({
    where: {
      email,
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

// get all users
const getAllUser = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return user;
};

const updateUser = async (id, firstName, lastName, email, password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
      email,
      password: hashPassword,
    },
  });
  return user;
};

// export
module.exports = {
  registerQuery,
  loginQuery,
  getAllUser,
  deleteUser,
  updateUser,
};
