const jwt = require('express-jwt');
const { secret } = require('config.json');
const mongoose=require('mongoose')

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),
        // authorize based on user role
        (req, res, next) => {
            // console.log(req.user);        //to check if signed data is correctly passed
            if (roles.length && !roles.includes(req.user.userType)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized User cannot access' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}