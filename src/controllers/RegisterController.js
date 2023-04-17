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

  async show(request, response) {
    const { name, email, phone, birthday, hometown, company } = request.query;
  
    let usersQuery = knex("users");
  
    // Aplica filtro para name
    if (name) {
      usersQuery = usersQuery.where("name", "like", `%${name}%`);
    }
  
    // Aplica filtro para email
    if (email) {
      usersQuery = usersQuery.where("email", "like", `%${email}%`);
    }
  
    // Aplica filtro para phone
    if (phone) {
      usersQuery = usersQuery.where("phone", "like", `%${phone}%`);
    }
  
    // Aplica filtro para birthday
    if (birthday) {
      usersQuery = usersQuery.where("birthday", "like", `%${birthday}%`);
    }
  
    // Aplica filtro para hometown
    if (hometown) {
      usersQuery = usersQuery.where("hometown", "like", `%${hometown}%`);
    }
  
    // Aplica filtro para company
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
      .select("register.id", "users.id as user_id", "users.name as user_name", "companies.id as company_id", "companies.name as company_name")
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
  
    const registers = await query;
  
    const data = registers.map((register) => {
      return {
        id: register.id,
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
      return response.status(404).json({ error: "Register not found" });
    }

    return response.sendStatus(204);
  }
}

module.exports = RegisterController;