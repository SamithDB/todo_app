const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const bodyParser = require("body-parser");

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Create the Express application
const app = express();

// Allows our Angular application to make HTTP requests to Express application
// noinspection JSCheckFunctionSignatures
app.use(cors());

app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require("./config/database");

// Pass the global passport object into the configuration function
require("./config/passport")(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Where Angular builds to - In the ./angular/angular.json file, you will find this configuration
// at the property: projects.angular.architect.build.options.outputPath
// When you run `ng build`, the output will go to the ./public directory
//app.use(express.static(path.join(__dirname, "public"))); // eslint-disable-line no-undef

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(require("./authentication/routes"));
app.use(require("./todo/routes"));

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:8080
app.listen(process.env.PORT || 8080);