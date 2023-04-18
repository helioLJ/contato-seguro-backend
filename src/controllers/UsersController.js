const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");

const userRepository = new UserRepository()

class UsersController {
  async create(request, response) {
    const { name, email, phone, birthday, hometown } = request.body;

    const userCreateService = new UserCreateService(userRepository)
    await userCreateService.execute({ name, email, phone, birthday, hometown })

    return response.status(201).json({ message: "Usuário criado com sucesso!" });
  }

  async update(request, response) {
    const { name, email, phone, birthday, hometown } = request.body;
    const { id } = request.params;

    // Verifica se todos os campos estão preenchidos
    if (!name || !email || !phone || !birthday || !hometown) {
      throw new AppError('Preencha todos os campos obrigatórios.', 400)
    }

    // Verifica se o usuário existe
    const user = await knex("users").where({ id }).first();
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404)
    }

    // Verifica se o email já está em uso por outro usuário
    if (email !== user.email) {
      const emailExists = await knex('users').where('email', email).first();

      if (emailExists) {
        throw new AppError('Email já cadastrado.', 400)
      }
    }

    // Atualiza o usuário no banco de dados
    const now = new Date();
    const formattedNow = now.toISOString().replace('T', ' ').substr(0, 19);
    await knex("users").where({ id }).update({
      name,
      email,
      phone,
      birthday,
      hometown,
      updated_at: formattedNow
    });

    return response.json({ message: "Usuário editado com sucesso!" });
  }

  async index(request, response) {
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
      users = await knex('users')
        .orderBy('updated_at', 'desc')
        .select('*');
    }

    return response.json(users);
  }

  async delete(request, response) {
    const { id } = request.params;

    const deleted = await knex("users").where("id", id).delete();

    if (deleted === 0) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return response.sendStatus(204).json({ message: "Usuário deletado com sucesso." });
  }
}

module.exports = UsersController;