import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();




mongoose
  .connect(
    "mongodb+srv://dicsmail0575_db_user:WT0W37ZUXhexCmeC@cluster0.lyql4w1.mongodb.net/?appName=Cluster0",{
        dbName: "MERN-API"
    }
  ).then(() => {
        console.log("Connected to MongoDB");
    });



const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);




router.post("/register", express.json(), async (req, res) => {
  const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign(
        { userId: newUser._id },
        "xyz",
        { expiresIn: "1h" }
    );
    console.log(token);
    res.status(201).cookie("token", token).json({ message: "User registered successfully", userId: newUser._id });
});


router.post("/login", express.json(), async (req, res) => {
  const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id },
      "xyz",
        { expiresIn: "1h" }
    );
    res.status(200).cookie("token", token).json({ message: "Login successful", userId: user._id });
});




router.get("/logout", async (req, res) => {
    res.clearCookie("token").status(200).json({ success: true, message: "Logout successful" });
});
export default router;