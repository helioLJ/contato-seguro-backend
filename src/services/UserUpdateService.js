const AppError = require("../utils/AppError");

class UserUpdateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ id, name, email, phone, birthday, hometown }) {
    if (!name || !email || !id) {
      throw new AppError('Preencha todos os campos obrigatórios.', 400)
    }

    const user = await this.userRepository.verifyUser(id)

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404)
    }
    
    if (email !== user.email) {
      if (await this.userRepository.verifyEmail(email)) {
        throw new AppError('Email já cadastrado.', 400)
      }

    await this.userRepository.updatedUser(id, name, email, phone, birthday, hometown)
    }
  }
}

module.exports = UserUpdateService