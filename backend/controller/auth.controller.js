const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie.js');
const generateVerificationCode = require('../utils/generateVerificationCode.js');
const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const { sendVerificationToken, sendWelcomeEmail } = require('../mailtrap/email.js')


const Signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password || !phone) {
      throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
    });

    await user.save();
    generateTokenAndSetCookie(res, user._id, user.role);

    // sendVerificationToken(user.email, user.verificationToken);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// const verifyEmail = async (req, res) => {
//   const { code } = req.body;
//   try {
//     const user = await User.findOne({
//       verificationToken: code,
//       verificationTokenExpiresAt: { $gt: Date.now() }
//     })
//     if (!user) {
//       return res.status(400).json({ success: false, message: "Invalid or Expired verification token" })
//     }
//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenExpiresAt = undefined;
//     await user.save();

//     await sendWelcomeEmail(user.email, user.name);
//     res.status(200).json({
//       success: true,
//       message: "Email verified successfully",
//       user: {
//         ...user._doc,
//         password: undefined,
//       },
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).json({ success: false, message: error.message });
//   }
// }

const Signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, isUser.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: "Invalid email or password" })
    }
    generateTokenAndSetCookie(res, isUser._id, isUser.role)

    await isUser.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...isUser._doc,
        password: undefined,
      },
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: "Internal server error" })
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    await user.updateOne({
      resetToken: token, resetTokenExpiration: Date.now() +
        3600000
    });
  } catch (error) {

  }
}

const signOut = async (req, res) => {
  res.clearCookie('token').status(200).json({ success: true, message: "signout successfully" })
}

const updateUser = async (req, res) => {
  const { name, email, phone } = req.body;
  const userId = req.id;

  try {
    if (phone.toString().length !== 10 || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Please enter a 10-digit number."
      });
    }
    const user = await User.findById(userId);

    const isExistingUser = await User.findOne({ email });
    if (isExistingUser && email !== user.email) {
      return res.status(400).json({ success: false, message: "Email already exists." })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      user: userWithoutPassword
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Your session has expired. Please log in again."
    });
  }
};


const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect"
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password"
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update your password. Please try again."
    });
  }
};


module.exports = {
  Signup,
  Signin,
  signOut,
  updateUser,
  updatePassword
};
