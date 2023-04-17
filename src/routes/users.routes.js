const { Router } = require("express");

const usersRoutes = Router(); 

usersRoutes.post("/", (request, response) => {
  const { name, email, phone, birthday, hometown } = request.body;
  
  response.json({ name, email, phone, birthday, hometown });
});

module.exports = usersRoutes;