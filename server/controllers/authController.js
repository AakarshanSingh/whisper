import User from '../models/UserSchema.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      profilePic: '',
    });

    if (newUser) {
      const token = generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res
        .status(201)
        .json({ msg: 'User created successfully', newUser, token });
    } else {
      return res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    );

    if (!user || !isPasswordCorrect) {
      return res.json({ error: 'Invalid credentials' });
    }

    const token = generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
