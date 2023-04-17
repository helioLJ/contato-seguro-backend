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

  async update(request, response) {
    const { name, email, phone, birthday, hometown } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.birthday = birthday;
    user.hometown = hometown;

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      phone = ?,
      birthday = ?,
      hometown = ?,
      updated_at = DATETIME('now')

      WHERE id = ?`,
      [user.name, user.email, user.phone, user.birthday, user.hometown, id]
    );

    return response.status(200).json();
  }
}

module.exports = UsersController;