const User = require("../models/user.model");
const utils = require("../../lib/utils");
const errors = require("../../lib/error").getErrorData("authentication");

const checkUserType = (res, type) => {
    "use strict";
    const status_enum = User.schema.obj.user_type.enum;
    if (type && !status_enum.includes(type)) {
        res.status(403).json(errors.AUTH_403_INVALID_USER_TYPE);
        return false;
    }
    return true;
};

const checkStatusString = (res, string) => {
    "use strict";
    const status_enum = User.schema.obj.user_status_string.enum;
    if (string && !status_enum.includes(string)) {
        res.status(403).json(errors.AUTH_403_INVALID_STATUS_STR);
        return false;
    }
    return true;
};

module.exports.signup = (req, res) => {
    "use strict";

    if (!req.body.first_name) {
        return res.status(500).json(errors.AUTH_403_EMPTY_FIRST_NAME);
    }

    if (!req.body.last_name) {
        return res.status(500).json(errors.AUTH_403_EMPTY_LAST_NAME);
    }

    if (!req.body.username) {
        return res.status(500).json(errors.AUTH_403_EMPTY_USERNAME);
    }

    if (!req.body.password) {
        return res.status(500).json(errors.AUTH_403_EMPTY_PASSWORD);
    }

    if (!checkUserType(res, req.body.user_type)) {
        return;
    }

    if (!checkStatusString(res, req.body.user_status_string)) {
        return;
    }

    const saltHash = utils.genPassword(req.body.password);
    const salt = saltHash.salt;
    const password = saltHash.hash;

    const newUser = new User({
        user_first_name: req.body.first_name,
        user_last_name: req.body.last_name,
        user_username: req.body.username,
        user_password: password,
        user_salt: salt,
        user_type: req.body.type
    });

    newUser.save()
        .then(user => {
            user.user_password = undefined;
            user.user_salt = undefined;
            res.status(200).json(user);
        })
        .catch(err => {
            // noinspection JSUnresolvedVariable
            if (err.errors.user_username.kind === "unique") {
                return res.status(403).json(errors.AUTH_403_EXIST);
            }
            res.status(500).json(errors.AUTH_500_SIGNUP);
        });
};

module.exports.login = (req, res) => {
    "use strict";

    if (!req.body.username) {
        return res.status(500).json(errors.AUTH_403_EMPTY_USERNAME);
    }

    if (!req.body.password) {
        return res.status(500).json(errors.AUTH_403_EMPTY_PASSWORD);
    }

    User.findOne({ user_username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json(errors.AUTH_401_UNAUTHORIZED_INVALID_DETAILS);
            }

            const isValid = utils.validPassword(req.body.password, user.user_password, user.user_salt);
            if (isValid) {
                const tokenObject = utils.issueJWT(user);
                user.user_password = undefined;
                user.user_salt = undefined;
                res.status(200).json({
                    token: tokenObject.token,
                    expiresIn: tokenObject.expires,
                    user
                });
            } else {
                res.status(401).json(errors.AUTH_401_UNAUTHORIZED_INVALID_DETAILS);
            }
        })
        .catch(err => {
            res.status(500).json(errors.AUTH_500_LOGIN);
        });
};