import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { connect } from "mongoose";

import createError from "http-errors";
import GetBarang from "./controller/barangController.js";
import schema from "./lib/graphql/index.js";

const app = express();
const port = 3000;
const mongoDbUrl = "mongodb://127.0.0.1:27017";

//mongoDB
connect(mongoDbUrl, { dbName: "x-mart" })
  .then(() => console.log("***** Connected to MongoDB *****"))
  .catch((error) => console.log("MongoDB Error: ", error));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// route
app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
    pretty: true,
  })
);

app.get("/api/barang", (req, res, next) => {
  GetBarang(req, res);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error
  console.error(err.stack);
  res.status(err.status || 500).send({ status: "error", message: err.message });
});

app.listen(port, () => {
  console.log(`GraphQL server running on http://localhost:${port}`);
});
