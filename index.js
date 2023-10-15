var express = require("express");
var app = express();
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var pool = require("./db_connect");
var bodyParser = require("body-parser");
var movies = require("./Routes/movies");
var users = require("./Routes/users");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "0.1.0",
      description: "Homework 9",
    },
    servers: [
      {
        url: "https://localhost:3000",
      },
    ],
  },
  apis: ["./Routes/*"],
};

const specs = swaggerJSDoc(options);
app.use("/api.docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/movies", movies);
app.use("/users", users);

pool.connect((err, res) => {
  console.log(err), console.log("Connection Succes!");
});

app.listen(3000);
