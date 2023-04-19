class UserRepositoryInMemory {
  users = [];

  async verifyEmail(email) {
    return this.users.find(user => user.email === email)
  }

  async create(name, email, phone, birthday, hometown, id ) {
    const user = {
      name,
      email,
      phone,
      birthday,
      hometown,
      id
    }

    this.users.push(user)

    return user
  }

  async verifyUser(id) {
    let userObj
    this.users.find(user => {
      user.id === id ? userObj = user : false
    })
    return userObj
  }
}

module.exports = UserRepositoryInMemory