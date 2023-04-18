const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class RegisterController {
  async create(request, response) {
    const { user_id, company_id } = request.body;

    // Verifica se o registro já existe
    const existingRegister = await knex("register")
      .where({ user_id, company_id })
      .first();

    if (existingRegister) {
      throw new AppError("Registro já cadastrado.", 400)
    }

    // Verifica se o usuário e a empresa existem
    const user = await knex("users").where("id", user_id).first();
    if (!user) {
      throw new AppError("Usuário não encontrado.", 400)
    }
    const company = await knex("companies").where("id", company_id).first();
    if (!company) {
      throw new AppError("Empresa não encontrada.", 400)
    }

    // Insere o registro na tabela
    await knex("register").insert({
      user_id,
      company_id,
    });

    return response.status(201).json({ message: "Registro criado com sucesso!" });
  }

  async show(request, response) {
    const { name, email, phone, birthday, hometown, company } = request.query;

    let usersQuery = knex("users");

    if (name) {
      usersQuery = usersQuery.where("name", "like", `%${name}%`);
    }

    if (email) {
      usersQuery = usersQuery.where("email", "like", `%${email}%`);
    }

    if (phone) {
      usersQuery = usersQuery.where("phone", "like", `%${phone}%`);
    }

    if (birthday) {
      usersQuery = usersQuery.where("birthday", "like", `%${birthday}%`);
    }

    if (hometown) {
      usersQuery = usersQuery.where("hometown", "like", `%${hometown}%`);
    }

    if (company) {
      usersQuery = usersQuery.whereRaw(
        "EXISTS (SELECT 1 FROM register r JOIN companies c ON r.company_id = c.id WHERE r.user_id = users.id AND c.name LIKE ?)",
        [`%${company}%`]
      );
    }

    const users = await usersQuery.select("*");

    const data = await Promise.all(
      users.map(async (user) => {
        const companies = await knex("register")
          .join("companies", "companies.id", "=", "register.company_id")
          .where("register.user_id", user.id)
          .select("companies.name");

        return {
          user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            hometown: user.hometown,
          },
          companies: companies.map((company) => company.name),
        };
      })
    );

    return response.json(data);
  }

  async index(request, response) {
    const { userName, companyName } = request.query;

    let query = knex("register")
      .select("register.id", "register.created_at", "users.id as user_id", "users.name as user_name", "companies.id as company_id", "companies.name as company_name")
      .join("users", "users.id", "=", "register.user_id")
      .join("companies", "companies.id", "=", "register.company_id");


    // Aplica filtro para userName
    if (userName) {
      query = query.where("users.name", "like", `%${userName}%`);
    }

    // Aplica filtro para companyName
    if (companyName) {
      query = query.where("companies.name", "like", `%${companyName}%`);
    }

    query = query.orderBy("register.created_at", "desc");

    const registers = await query;

    const data = registers.map((register) => {
      return {
        id: register.id,
        created_at: register.created_at,
        user: {
          id: register.user_id,
          name: register.user_name,
        },
        company: {
          id: register.company_id,
          name: register.company_name,
        },
      };
    });

    return response.json(data);
  }

  async delete(request, response) {
    const { id } = request.params;

    const deleted = await knex("register").where("id", id).delete();

    if (deleted === 0) {
      throw new AppError("Registro não encontrado.", 404)
    }

    return response.status(204).json({ message: "Registro deletado com sucesso." })
  }
}

module.exports = RegisterController;