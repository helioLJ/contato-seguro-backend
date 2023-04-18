class UserRepositoryInMemory {
  users = [];

  async verifyEmail(email) {
    return this.users.find(user => user.email === email)
  }

  async create(name, email, phone, birthday, hometown ) {
    const user = {
      id: Math.floor(Math.random() * 1000) + 1,
      name,
      email,
      phone,
      birthday,
      hometown
    }

    this.users.push(user)

    return user
  }
}

module.exports = UserRepositoryInMemory