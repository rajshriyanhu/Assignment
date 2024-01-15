import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password)
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return res.status(404).json({ message: "User not found!" });
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword)
      return res.status(401).json({ message: "Wrong credentials!" });

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET,);
    const { password: pass, ...other } = validUser._doc;
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
  })
    res.status(200).json(other);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie('auth_token');
    res.status(200).json("User has been signed out");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifiedUser = async (req, res) => {
  res.status(200).json({message: "User is verified!"})
}
