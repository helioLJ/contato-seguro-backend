const knex = require("../database/knex");

class UserRepository {
  async verifyEmail(email) {
    return await knex("users").where({ email }).first();
  }

  async create(name, email, phone, birthday, hometown) {
    await knex("users").insert({
      name,
      email,
      phone,
      birthday,
      hometown,
    });
    return { email }
  }
}

module.exports = UserRepository