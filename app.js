const express = require("express");
const http = require("http");
const swaggerUI = require("swagger-ui-express");
const swaggerJSdoc = require("swagger-jsdoc");
const mongoose = require("mongoose");
const ComposerAPI = require("./routes/purselley-composer-routes");

let app = express();
//  app set variables
app.set("port", process.env.PORT || 3000); //  local host port
//  app use variables
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * MongoDB Atlas connection string
 */

const conn =
  "mongodb+srv://web420_user:s3cret@buwebdev-cluster-1.078ar.mongodb.net/web420DB?retryWrites=true&w=majority";
mongoose
  .connect(conn, {
    promiseLibrary: require("bluebird"),
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`Connection to web420DB on MongoDB Atlas successful`);
  })
  .catch((err) => {
    console.log(`MongoDB Error: ${err.message}`);
  });

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WEB 420 RESTful APIs",
      version: "1.0.0",
    }, //  end info
  }, //  end definition
  apis: ["./routes/purselley-composer-routes.js"], //  files containing annotations for the OpenAPI Specifications
};

const openapiSpecification = swaggerJSdoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(openapiSpecification));

app.use("/api", ComposerAPI);

http.createServer(app).listen(app.get("port"), function () {
  console.log(`Application started and listening on port ${app.get("port")}`);
});
