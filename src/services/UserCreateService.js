const AppError = require("../utils/AppError");

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, phone, birthday, hometown, id }) {
    if (!name || !email) {
      throw new AppError('Preencha todos os campos obrigatórios.', 400)
    }

    if (await this.userRepository.verifyEmail(email)) {
      throw new AppError('Email já cadastrado.', 400)
    }

    try {
      const userCreated = await this.userRepository.create(name, email, phone, birthday, hometown, id)
      return userCreated
    } catch {
      throw new AppError('Erro ao criar usuário.', 500)
    }
  }
}

module.exports = UserCreateService