const UserCreateService = require("./UserCreateService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory");
const AppError = require("../utils/AppError");

describe("UserCreateService", () => {
  let userRepositoryInMemory = null
  let userCreateService = null

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userCreateService = new UserCreateService(userRepositoryInMemory)
  })

  it("user should be create", async () => {
    const user = {
      name: "User Test",
      email: "user@test.com",
      phone: "99999999999",
      birthday: "00/00/2000",
      hometown: "Test City"
    }

    const userCreated = await userCreateService.execute(user)

    expect(userCreated).toHaveProperty("email")
  });

  it("user should not be create with exissts email", async () => {
    const user1 = {
      name: "User Test",
      email: "user@test.com",
      phone: "99999999999",
      birthday: "00/00/2000",
      hometown: "Test City"
    }

    const user2 = {
      name: "User Test 2",
      email: "user@test.com",
      phone: "99999999999",
      birthday: "00/00/2000",
      hometown: "Test City"
    }

    await userCreateService.execute(user1)
    await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError('Email já cadastrado.'))
  });
});