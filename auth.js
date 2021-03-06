const jwtSecret = 'your_jwt_secret'; //this has to be the same key used in the JWTStrategy
const jwt = require('jsonwebtoken'),
  passport = require('passport');
require('./passport'); //your local passport file

function generateJWTToken(user) {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, //this is the username you're encoding in the JWT
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

/* POST login */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "something is not right",
          user: user
        });
      }
      req.login(user, {session: false}, (error) => {
        if(error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
