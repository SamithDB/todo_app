const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const fs = require("fs");
const path = require("path");
const User = require("../authentication/models/user.model");

// eslint-disable-next-line no-undef
const pathToKey = path.join(__dirname, "../config/keys", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ["RS256"]
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    "use strict";

    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {

        // We will assign the `sub` property on the JWT to the database ID of login
        User.findOne({ _id: jwt_payload.sub }, (err, login) => {

            // This flow look familiar?  It is the same as when we implemented
            // the `passport-local` strategy
            if (err) {
                return done(err, false);
            }
            if (!login) {
                return done(null, false);
            }
            return done(null, login);
        });

    }));
};