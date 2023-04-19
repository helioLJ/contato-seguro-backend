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

  async verifyUser(id) {
    return await knex("users").where({ id }).first();
  }

  async updatedUser(id, name, email, phone, birthday, hometown) {
    const now = new Date();
    const formattedNow = now.toISOString().replace('T', ' ').substr(0, 19);
    await knex("users").where({ id }).update({
      name,
      email,
      phone,
      birthday,
      hometown,
      updated_at: formattedNow
    })
  }
}

module.exports = UserRepository