const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const restricted = require("../auth/restricted-middleware.js");
const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

const server = express();

const sessionConfig = {
  name: "tzsession",
  secret: "myspeshulsecret",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // should be true in production
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,

  //now session will be created in our db, not in a memory
  // store: new knexSessionStore({
  //   knex: require("../database/dbConfig.js"),
  //   tablename: "sessions",
  //   sidfieldname: "sid",
  //   createtable: true,
  //   clearInterval: 1000 * 60 * 60,
  // }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
server.use("/api/auth", authRouter);
server.use("/api/users", restricted, usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

// server.get('/token', (req, res)=>{
//   //jwt.sigh(payload, secreOrPrivateKey, [oprions, callback])
// //each property in a payload is a claim, p using only in a client side
//   const payload={
// subject: "thisuser",
// userid:"tz",
// favoriteChili:"habanero"
//   }
//   //secret
//   const secret = "mysecret"
//   const options = {
//     expiresIn:'30m' //or 7h, 4d
//   }
//   //create a token
//   const token = jwt.sigh(payload, secret, otions);
//   //return token
//   res.json(token);
// })
//go to Postman: localhost:5000/token --got token
//we can decode it in jwt.io

module.exports = server;
