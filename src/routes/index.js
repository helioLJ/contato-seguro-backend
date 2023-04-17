const { Router } = require("express");

const usersRoutes = require("./users.routes");
const companiesRoutes = require("./companies.routes");
const registerRoutes = require("./register.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/companies", companiesRoutes);
routes.use("/register", registerRoutes);

module.exports = routes;