const User = require("../Schemas/Users");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.JWT_SECRET;
// the client is sending this body object
//  {
//     email: form.email,
//     password: form.password,
//     password2: form.password2
//  }
// Register
const register = async (req, res, next) => {
  const salt = "914donkey";
  const { email, password, password2, name, surname, instructor } = req.body;
  if (!email || !password || !password2 || !name || !surname) {
    return res.json({ ok: false, message: "All fields required" });
  }
  if (password !== password2) {
    return res.json({ ok: false, message: "Passwords must match" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ ok: false, message: "Invalid email" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) return res.json({ ok: false, message: "User exists" });
    const hash = await argon2.hash(password, salt);
    // not salted, salt is appending a random string to a password to strengthen the hash
    const hash2 = await argon2.hash(password);
    // we can see that hashes for salted and unsalted are different
    console.log("hash ==>", hash);
    console.log("hash2 ==>", hash2);

    const newUser = {
      email,
      password: hash,
      name,
      surname,
      type: instructor ? "instructor" : "user",
    };
    await User.create(newUser);
    // res.json({ ok: true, message: "Successfully registered" });
    next(); // executes the next controller
  } catch (error) {
    console.log(error);
    res.json({ ok: false, error });
  }
};
// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ ok: false, message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ ok: false, message: "Invalid email provided" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: false, message: "Invalid user provided" });
    const match = await argon2.verify(user.password, password);
    if (match) {
      // once user is verified and confirmed we send back the token to keep in localStorage in the client and in this token we can add some data -- payload -- to retrieve from the token in the client and see, for example, which user is logged in exactly. The payload would be the first argument in .sign() method. In the following example we are sending an object with key userEmail and the value of email coming from the "user" found in line 47
      const token = jwt.sign(
        { userEmail: user.email, userType: user.type, userId: user._id },
        jwt_secret,
        {
          expiresIn: "1h",
        }
      );
      res.json({ ok: true, message: "welcome back", token, user });
    } else return res.json({ ok: false, message: "Invalid data provided" });
  } catch (error) {
    res.json({ ok: false, error });
  }
};
// verify token
const verify_token = (req, res) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({
      ok: false,
      message: "Authorization header is missing or not correctly formatted",
    });
  }

  const token = authHeader.split(" ")[1]; // Get the token part

  jwt.verify(token, jwt_secret, (err, decodedToken) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.json({ ok: false, message: "Token is corrupted or expired" });
    }
    // Optionally, you can attach the decoded token to the request if you want to use it later in the chain
    req.user = decodedToken;
    return res.json({
      ok: true,
      message: "Token is valid",
      user: decodedToken,
    });
  });
};

// deleteUser
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.send({ ok: false, message: "User not found" });
    }

    res.send({ ok: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.send({ ok: false, message: "Error deleting user" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  console.log(userId);
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.send({ ok: false, message: "user not found" });
    }
    res.send({ ok: true, data: updatedUser });
  } catch (error) {
    res.status(500).send({ ok: false, message: "Error updating user details" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.send({ message: "User not found" });
    }
    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.send({ message: "Error fetching user details" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send({
      ok: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};
const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ type: "instructor" });
    res.send({
      ok: true,
      data: instructors,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ ok: false, message: "Error fetching instructor details" });
  }
};
const getNormalUsers = async (req, res) => {
  try {
    const normalUsers = await User.find({ type: "user" });
    res.send({
      ok: true,
      data: normalUsers,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ ok: false, message: "Error fetching normal user details" });
  }
};
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ ok: false, message: "Authentication token required" });
    }

    const decoded = jwt.verify(token, jwt_secret);
    const user = await User.findById(decoded.userId); // Assuming your JWT contains the userId
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    req.userId = user._id; // Setting userId for access in subsequent middleware/routes
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ ok: false, message: "Invalid or expired token" });
  }
};
module.exports = {
  register,
  login,
  verify_token,
  deleteUser,
  updateUser,
  getUserById,
  getAllUsers,
  getInstructors,
  getNormalUsers,
  authenticate,
};
