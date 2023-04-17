const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, phone, birthday, hometown } = request.body;

    const database = await sqliteConnection();
    const checkUsersExists = await database.get("SELECT * FROM users WHERE EMAIL = (?)", [email]);

    if (checkUsersExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    await database.run("INSERT INTO users (name, email, phone, birthday, hometown) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, birthday, hometown]
    );

    return response.status(201).json();
  }
}

module.exports = UsersController;