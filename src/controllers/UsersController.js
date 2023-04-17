const AppError = require("../utils/AppError");

class UsersController {
  create(request, response) {
    const { name, email, phone, birthday, hometown } = request.body;

    if(!name) {
      throw new AppError("Nome é obrigatório.")
    }

    response.json({ name, email, phone, birthday, hometown });
  }
}

module.exports = UsersController;