const knex = require("../database/knex");

class RegisterController {
  async create(request, response) {
    const { user_id, company_id } = request.body;

    // Verifica se o registro já existe
    const existingRegister = await knex("register")
      .where({ user_id, company_id })
      .first();

    if (existingRegister) {
      return response.status(400).json({ error: "Register already exists" });
    }

    // Verifica se o usuário e a empresa existem
    const user = await knex("users").where("id", user_id).first();
    if (!user) {
      return response.status(400).json({ error: "User not found" });
    }
    const company = await knex("companies").where("id", company_id).first();
    if (!company) {
      return response.status(400).json({ error: "Company not found" });
    }

    // Insere o registro na tabela
    await knex("register").insert({
      user_id,
      company_id,
    });

    // Retornar o nome do usuário e da empresa em formato JSON
    return response.json({ user: user.name, company: company.name });
  }

  async index(request, response) {
    const users = await knex("users").select("*");
  
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

  async show(request, response) {
    const { id } = request.params;

    // Busca o usuário
    const user = await knex("users").where("id", id).first();
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Busca as empresas vinculadas ao usuário
    const companies = await knex("companies")
      .join("register", "register.company_id", "companies.id")
      .where("register.user_id", id)
      .select("companies.*");

    // Retorna o objeto com o nome do usuário e as companies
    return response.json({
      user: user.name,
      companies: companies.map(company => company.name),
    });
  }
  
  async delete(request, response) {
    const { id } = request.params;

    const deleted = await knex("register").where("id", id).delete();

    if (deleted === 0) {
      return response.status(404).json({ error: "Register not found" });
    }

    return response.sendStatus(204);
  }
}

module.exports = RegisterController;