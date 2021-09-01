const fs = require("fs");

module.exports.getErrorData = (packageName) => {
    "use strict";
    return JSON.parse(fs.readFileSync(packageName + "/assets/error-data.json", "utf8"));
};