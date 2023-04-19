const UserUpdateService = require("./UserUpdateService")
const UserCreateService = require("./UserCreateService");
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory");
const AppError = require("../utils/AppError");

describe("UserUpdateService", () => {
  let userRepositoryInMemory = null
  let userUpdateService = null

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userUpdateService = new UserUpdateService(userRepositoryInMemory)
    userCreateService = new UserCreateService(userRepositoryInMemory)
  })

  it("user should exist", async () => {
    const user1 = {
      name: "User Test",
      email: "user1@test.com",
      phone: "99999999999",
      birthday: "00/00/2000",
      hometown: "Test City",
      id: 1
    }

    const user2 = {
      name: "User Test 2",
      email: "user2@test.com",
      phone: "99999999999",
      birthday: "00/00/2000",
      hometown: "Test City",
      id: 2
    }

    await userCreateService.execute(user1)

    await expect(userUpdateService.execute(user2)).rejects.toEqual(new AppError('Usuário não encontrado.', 404))
  })

  it("user should not update a existing email", async () => {
    const user1 = {
      name: "User Test",
      email: "user1@test.com",
      phone: "99999999999",
      birthday: "00/00/2000",
      hometown: "Test City",
      id: 1
    }
    const user2 = {
      name: "User Test 2",
      email: "user2@test.com",
      phone: "99999999999",
      birthday: "00/00/2000",
      hometown: "Test City",
      id: 2
    }
    const user1updating = {
      name: "User Test",
      email: "user2@test.com",
      phone: "99999999999",
      birthday: "00/00/2000",
      hometown: "Test City",
      id: 1
    }

    await userCreateService.execute(user1)
    await userCreateService.execute(user2)

    await expect(userUpdateService.execute(user1updating)).rejects.toEqual(new AppError('Email já cadastrado.', 400))
  });
});