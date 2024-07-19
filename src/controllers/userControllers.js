const { registerQuery, loginQuery } = require("../queries/userQuery");

const register = async (req, res) => {
  const token = await registerQuery(req.body);
  res.send(token);
};

const login = async (req, res) => {
  const token = await loginQuery(req.body);
  res.send(token);
};

module.exports = {
  register,
  login,
};
