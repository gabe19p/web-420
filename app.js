const express = require("express");
const http = require("http");
const swaggerUI = require("swagger-ui-express");
const swaggerJSdoc = require("swagger-jsdoc");
const mongoose = require("mongoose");

let app = express();
//  app set variables
app.set("port", process.env.PORT || 3000); //  local host port
//  app use variables
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WEB 420 RESTful APIs",
      version: "1.0.0",
    }, //  end info
  }, //  end definition
  apis: ["./routes/*.js"], //  files containing annotations for the OpenAPI Specifications
};

const openapiSpecification = swaggerJSdoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(openapiSpecification));

http.createServer(app).listen(app.get("port"), function () {
  console.log(`Application started and listening on port ${app.get("port")}`);
});
