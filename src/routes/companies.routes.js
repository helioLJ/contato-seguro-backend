const { Router } = require("express");

const CompaniesController = require("../controllers/CompaniesController");

const companiesRoutes = Router(); 

const companiesController = new CompaniesController();

companiesRoutes.post("/", companiesController.create);
companiesRoutes.put("/:id", companiesController.update);
companiesRoutes.get("/", companiesController.index);
companiesRoutes.delete("/:id", companiesController.delete);

module.exports = companiesRoutes;