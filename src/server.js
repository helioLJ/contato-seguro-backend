require("express-async-errors");
require("dotenv/config")

const AppError = require("./utils/AppError");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

const app = express();
app.use(cors())
app.use(express.json());

app.use(routes);

app.use(( error, request, response, next ) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "Error",
      message: error.message
    });
  }; // Error do cliente

  console.log(error);

  return response.status(500).json({
    status: "Error",
    message: "Internal server error"
  }); // Error do servidor
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));