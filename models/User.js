const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// mongoose hooks/ fires a function after and event or something has been saved to the database

// userSchema.post("save", (doc, next) => {
//   console.log("New user has been created successfully", doc);
//   next();
// });

// function that fires befores saving to the database

userSchema.pre("save", async function (next) {
  // console.log("User about to be created", this);

  // generate salt
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  {
    throw Error("Incorrect email");
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
