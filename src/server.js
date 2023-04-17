const express = require("express");

const app = express();
app.use(express.json());

app.post("/users", (request, response) => {
  const { name, email, phone, birthday, hometown } = request.body;
  
  response.json({ name, email, phone, birthday, hometown });
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));