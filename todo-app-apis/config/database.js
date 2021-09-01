const mongoose = require("mongoose");

// Setting up options for mongodb
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

require("dotenv").config();

const devConnection = process.env.DB_STRING;        // Connection string for dev
const prodConnection = process.env.DB_STRING_PROD;  // Connection string for prod

// Connect to the correct environment database
if (process.env.NODE_ENV === "production") {
    mongoose.connect(prodConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // noinspection JSUnresolvedFunction
    mongoose.connection.on("connected", () => {
        "use strict";
        global.console.log("Database connected");
    });
} else {
    mongoose.connect(devConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // noinspection JSUnresolvedFunction
    mongoose.connection.on("connected", () => {
        "use strict";
        global.console.log("Database connected");
    });
}