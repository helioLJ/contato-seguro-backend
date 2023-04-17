const knex = require("../database/knex");

class UsersController {
  async create(request, response) {
    const { name, email, phone, birthday, hometown } = request.body;

    // Verifica se todos os campos foram preenchidos
    if (!name || !email || !phone || !birthday || !hometown) {
      return response
        .status(400)
        .json({ error: "Preencha todos os campos obrigatórios." });
    }

    // Verifica se o email já está cadastrado
    const userExists = await knex("users").where({ email }).first();
    if (userExists) {
      return response.status(400).json({ error: "Email já cadastrado." });
    }

    // Insere o novo usuário no banco de dados
    try {
      const [userId] = await knex("users").insert({
        name,
        email,
        phone,
        birthday,
        hometown,
      });

      return response.status(201).json({ id: userId, name, email });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao criar usuário." });
    }
  }

  async update(request, response) {
    const { name, email, phone, birthday, hometown } = request.body;
    const { id } = request.params;

    // Verifica se todos os campos estão preenchidos
    if (!name || !email || !phone || !birthday || !hometown) {
      return response.status(400).json({ error: "All fields are required." });
    }

    // Verifica se o usuário existe
    const user = await knex("users").where({ id }).first();
    if (!user) {
      return response.status(404).json({ error: "User not found." });
    }

    // Verifica se o email já está em uso por outro usuário
    if (email !== user.email) {
      const emailExists = await knex('users').where('email', email).first();

      if (emailExists) {
        return response.status(400).json({ error: 'Email already in use' });
      }
    }

    // Atualiza o usuário no banco de dados
    await knex("users").where({ id }).update({
      name,
      email,
      phone,
      birthday,
      hometown
    });

    return response.json({ message: "User updated successfully." });
  }

  async show(request, response) {
    const { name, email, phone, birthday, hometown } = request.query;

    let users;

    if (name) {
      users = await knex('users')
        .where('name', 'like', `%${name}%`)
        .select('*');
    } else if (email) {
      users = await knex('users')
        .where('email', 'like', `%${email}%`)
        .select('*');
    } else if (phone) {
      users = await knex('users')
        .where('phone', 'like', `%${phone}%`)
        .select('*');
    } else if (birthday) {
      users = await knex('users')
        .where('birthday', 'like', `%${birthday}%`)
        .select('*');
    } else if (hometown) {
      users = await knex('users')
        .where('hometown', 'like', `%${hometown}%`)
        .select('*');
    } else {
      users = await knex("users").select("*");
    }

    return response.json(users);
  }


  async delete(request, response) {
    const { id } = request.params;

    const deleted = await knex("users").where("id", id).delete();

    if (deleted === 0) {
      return response.status(404).json({ error: "User not found" });
    }

    return response.sendStatus(204);
  }
}

module.exports = UsersController;