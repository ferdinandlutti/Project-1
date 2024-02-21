const express = require("express"),
  app = express(),
  mongoose = require("mongoose");
app.use(require("cors")());
require("dotenv").config();
const port = process.env.PORT;

// to print incoming requests from mongoose in the terminal
mongoose.set("debug", true);
// Accept certain POST body types
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connecting to mongoDB
async function connecting() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the server-database");
  } catch (error) {
    console.log(
      "ERROR: Seems like your DB is not running, please start it up !!!"
    );
  }
}

// const categoriesRouter = require("./routes/categories");

// const productsRouter = require("./routes/products");

// Redirect to routers
// app.use("/category", categoriesRouter);
// app.use("/product", productsRouter);
// ADMINJS

// first install adminjs and the dependencies
// npm i adminjs @adminjs/express @adminjs/mongoose  tslib express-formidable express-session

// require adminjs
const AdminJS = require("adminjs");
// require express plugin
const AdminJSExpress = require("@adminjs/express");
// require mongoose adapter
AdminJS.registerAdapter(require("@adminjs/mongoose"));
// Import all the project's models
const Classes = require("./Schemas/classes"); // replace this for your model
const Users = require("./Schemas/Users"); // replace this for your model
// set up options -- models to use and a route to open dashboard
const reviews = require("./Schemas/reviews");
const bookings = require("./Schemas/booking");
const categories = require("./Schemas/categories");
const adminOptions = {
  resources: [Classes, Users, reviews, bookings, categories],
  rootPath: "/admin",
};
const classRouter = require("./routes/classes");
app.use("/class", classRouter);

const userRouter = require("./routes/users");
app.use("/user", userRouter);
const bookingRouter = require("./routes/booking");
app.use("/booking", bookingRouter);
const reviewRouter = require("./routes/reviews");
app.use("/review", reviewRouter);
const categoriesRouter = require("./routes/categories");
app.use("/category", categoriesRouter);
const instructorRouter = require("./routes/instructor");
app.use("/instructor", instructorRouter);

// initialize adminjs
const admin = new AdminJS(adminOptions);
// build admin route
const router = AdminJSExpress.buildRouter(admin);
app.use(admin.options.rootPath, router);
// end ADMINJS
connecting().then(() => {
  app.listen(port, () => console.log(`listening on port ${port}`));
});
