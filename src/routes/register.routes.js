const { Router } = require("express");

const RegisterController = require("../controllers/RegisterController");

const registerRoutes = Router(); 

const registerController = new RegisterController();

registerRoutes.post("/", registerController.create);
registerRoutes.get("/list", registerController.show);
registerRoutes.get("/", registerController.index);
registerRoutes.delete("/:id", registerController.delete);

module.exports = registerRoutes;