class UsersController {
  create(request, response) {
    const { name, email, phone, birthday, hometown } = request.body;

    response.json({ name, email, phone, birthday, hometown });
  }
}

module.exports = UsersController;