const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://myAtlasDBUser:123455@myatlasclusteredu.kmyoknr.mongodb.net/ninja_jwt_one?retryWrites=true&w=majority&appName=myAtlasClusterEDU";

// port

const port = process.env.PORT || 3000;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(port, () => {
      console.log(`Listening to port: ${port}`);
    })
  )
  .catch((err) => console.log(err));

// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies"));
app.use(authRoutes);

// cookies cheat sheet

app.get("/set-cookies", (req, res) => {
  // res.setHeader("set-cookie", "newUser=true");

  //NOTE:: wen a cookie already exist a cookie will be updated into a new value instead.
  res.cookie("newUser", false);

  // NOTE: The second arguement is how long the cookie should last.
  // we can also have third arguement of secure: true which will only send the cookie only on secure connection e.g https
  // another arguement could be httpOnly which won't let us access the cookie from the front end using javascript.

  res.cookie("isEmployee", false, { maxAge: 1000 * 60 * 60 * 24 });
  res.send("You got a new cookie");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  res.send(cookies);
});
